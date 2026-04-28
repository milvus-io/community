---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6 : Quel modèle utiliser ?'
author: Lumina Wang
date: 2026-4-28
cover: >-
  assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_1_98e0113041.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Comparer DeepSeek V4, GPT-5.5, et Qwen3.6 dans les tests d'extraction, de
  débogage et de contexte long, puis construire un pipeline RAG Milvus avec
  DeepSeek V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>Les nouveaux modèles sortent plus vite que les équipes de production ne peuvent les évaluer. DeepSeek V4, GPT-5.5 et Qwen3.6-35B-A3B semblent tous très performants sur le papier, mais la question la plus difficile pour les développeurs d'applications d'IA est d'ordre pratique : quel modèle utiliser pour les systèmes à forte extraction, les tâches de codage, l'analyse des contextes longs et les <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a>?</p>
<p><strong>Cet article compare les trois modèles dans des tests pratiques :</strong> recherche d'informations en direct, débogage en mode concurrentiel et recherche de marqueurs en contexte long. Il montre ensuite comment connecter DeepSeek V4 à la <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielles Milvus</a>, afin que le contexte récupéré provienne d'une base de connaissances consultable plutôt que des seuls paramètres du modèle.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">Que sont DeepSeek V4, GPT-5.5 et Qwen3.6-35B-A3B ?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5 et Qwen3.6-35B-A3B sont des modèles d'IA différents qui ciblent des parties différentes de la pile de modèles.</strong> DeepSeek V4 se concentre sur l'inférence de contexte long à poids ouvert. GPT-5.5 se concentre sur les performances hébergées à la frontière, le codage, la recherche en ligne et les tâches nécessitant beaucoup d'outils. Qwen3.6-35B-A3B se concentre sur le déploiement multimodal à poids ouvert avec une empreinte de paramètres actifs beaucoup plus petite.</p>
<p>La comparaison est importante car un système de <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">recherche vectorielle de production</a> dépend rarement du modèle seul. La capacité du modèle, la longueur du contexte, le contrôle du déploiement, la qualité de la recherche et le coût du service ont tous une incidence sur l'expérience finale de l'utilisateur.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4 : un modèle MoE à poids ouvert pour le contrôle des coûts des contextes longs</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>est une famille de modèles MoE à poids ouvert publiée par DeepSeek le 24 avril 2026.</strong> Le communiqué officiel mentionne deux variantes : DeepSeek V4-Pro et DeepSeek V4-Flash. V4-Pro a un total de 1,6T de paramètres avec 49B activés par jeton, tandis que V4-Flash a un total de 284B de paramètres avec 13B activés par jeton. Tous deux prennent en charge une fenêtre contextuelle de 1 million de tokens.</p>
<p>La <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">carte de modèle DeepSeek V4-Pro</a> indique également que le modèle est sous licence MIT et qu'il est disponible auprès de Hugging Face et ModelScope. Pour les équipes qui créent des flux de documents à contexte long, le principal attrait est la maîtrise des coûts et la souplesse de déploiement par rapport à des API de frontière entièrement fermées.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5 : un modèle frontière hébergé pour le codage, la recherche et l'utilisation d'outils</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>est un modèle frontière fermé publié par OpenAI le 23 avril 2026.</strong> OpenAI le positionne pour le codage, la recherche en ligne, l'analyse de données, le travail sur documents, le travail sur tableur, l'utilisation de logiciels et les tâches basées sur des outils. La documentation officielle du modèle mentionne <code translate="no">gpt-5.5</code> avec une fenêtre contextuelle API de 1 million de jetons, tandis que les limites des produits Codex et ChatGPT peuvent différer.</p>
<p>OpenAI fait état d'excellents résultats aux tests de codage : 82,7 % sur Terminal-Bench 2.0, 73,1 % sur Expert-SWE et 58,6 % sur SWE-Bench Pro. La contrepartie est le prix : la tarification officielle de l'API indique que GPT-5.5 est de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>5 pour 1</mn></mrow><annotation encoding="application/x-tex">million de jetons d'entrée</annotation><mrow><mn>et de</mn><mi>5</mi></mrow></semantics></math></span></span>pour <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">1 million de jetons</annotation></semantics></math></span></span>d'entrée et <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> de 5 pour 1 million de jetons d'entrée et de</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">30</span></span></span></span>pour 1 million de jetons de sortie, avant tout détail de tarification spécifique à un produit ou à un contexte long.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B : un modèle à paramètres actifs plus petit pour les charges de travail locales et multimodales</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>est un modèle MoE à poids ouvert de l'équipe Qwen d'Alibaba.</strong> Sa carte de modèle répertorie 35B paramètres totaux, 3B paramètres activés, un encodeur de vision et une licence Apache-2.0. Il prend en charge une fenêtre contextuelle native de 262 144 jetons et peut s'étendre à environ 1 010 000 jetons avec la mise à l'échelle YaRN.</p>
<p>Qwen3.6-35B-A3B est donc intéressant lorsque le déploiement local, les services privés, la saisie d'images ou les charges de travail en langue chinoise sont plus importants que la commodité d'un modèle de frontière géré.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6 : Comparaison des spécifications des modèles</h3><table>
<thead>
<tr><th>Modèle</th><th>Modèle de déploiement</th><th>Informations publiques sur les paramètres</th><th>Fenêtre contextuelle</th><th>Ajustement le plus fort</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>MoE à poids ouvert ; API disponible</td><td>1,6T au total / 49B actifs</td><td>1M de jetons</td><td>Déploiements d'ingénierie à long terme et sensibles aux coûts</td></tr>
<tr><td>GPT-5.5</td><td>Modèle fermé hébergé</td><td>Non divulgué</td><td>1 million de jetons dans l'API</td><td>Codage, recherche en direct, utilisation d'outils et capacité globale la plus élevée</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>MdE multimodal à poids ouvert</td><td>35B total / 3B actif</td><td>262K natifs ; ~1M avec YaRN</td><td>Déploiement local/privé, saisie multimodale et scénarios en langue chinoise</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">Comment nous avons testé DeepSeek V4, GPT-5.5 et Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>Ces tests ne remplacent pas les suites de tests complets. Il s'agit de vérifications pratiques qui reflètent les questions courantes que se posent les développeurs : le modèle peut-il extraire des informations actuelles, raisonner sur des bogues de code subtils et localiser des faits dans un document très long ?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">Quel modèle gère le mieux la recherche d'informations en temps réel ?</h3><p>Nous avons posé à chaque modèle trois questions sensibles au temps en utilisant la recherche sur le web lorsqu'elle était disponible. La consigne était simple : ne renvoyer que la réponse et inclure l'URL source.</p>
<table>
<thead>
<tr><th>Question</th><th>Réponse attendue au moment du test</th><th>Source</th></tr>
</thead>
<tbody>
<tr><td>Combien coûte la génération d'une image de qualité moyenne de 1024×1024 à l'adresse <code translate="no">gpt-image-2</code> via l'API OpenAI ?</td><td><code translate="no">$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">Prix de la génération d'images OpenAI</a></td></tr>
<tr><td>Quelle est la chanson numéro 1 du Billboard Hot 100 de cette semaine, et qui en est l'artiste ?</td><td><code translate="no">Choosin' Texas</code> par Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Palmarès Billboard Hot 100</a></td></tr>
<tr><td>Qui est actuellement en tête du classement des pilotes de F1 2026 ?</td><td>Kimi Antonelli</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Classement des pilotes de Formule 1</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Remarque : ces questions sont sensibles au temps. Les réponses attendues reflètent les résultats au moment où nous avons effectué le test.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>La page de tarification des images d'OpenAI utilise l'étiquette "medium" plutôt que "standard" pour le résultat de 0,053 $ 1024×1024, la question est donc normalisée ici pour correspondre à la formulation actuelle de l'API.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Résultats de la recherche en temps réel : GPT-5.5 a le plus grand avantage</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro a répondu de manière incorrecte à la première question. Il n'a pas pu répondre aux deuxième et troisième questions par le biais d'une recherche en direct sur le web dans cette configuration.</p>
<p>La deuxième réponse comprenait l'URL Billboard correcte, mais n'a pas permis de retrouver la chanson numéro 1 du moment. La troisième réponse utilisait la mauvaise source, nous l'avons donc considérée comme incorrecte.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 a beaucoup mieux géré ce test. Ses réponses étaient courtes, précises, sourcées et rapides. Lorsqu'une tâche dépend d'informations actuelles et que le modèle dispose d'une récupération en direct, GPT-5.5 a un net avantage dans cette configuration.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B a produit un résultat similaire à celui de DeepSeek V4-Pro. Il ne disposait pas d'un accès en direct au Web dans cette configuration et n'a donc pas pu effectuer la tâche de recherche en temps réel.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">Quel modèle est le plus performant pour déboguer les bogues de simultanéité ?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Le deuxième test utilisait un exemple de transfert bancaire en Python avec trois niveaux de problèmes de simultanéité. La tâche ne consistait pas seulement à trouver la condition de concurrence évidente, mais aussi à expliquer pourquoi le solde total s'interrompt et à fournir un code corrigé.</p>
<table>
<thead>
<tr><th>Couche</th><th>Problème</th><th>Ce qui ne va pas</th></tr>
</thead>
<tbody>
<tr><td>De base</td><td>Condition de course</td><td><code translate="no">if self.balance &gt;= amount</code> et <code translate="no">self.balance -= amount</code> ne sont pas atomiques. Deux threads peuvent passer la vérification du solde en même temps, puis tous deux soustraire de l'argent.</td></tr>
<tr><td>Moyen</td><td>Risque de blocage</td><td>Un verrouillage naïf par compte peut entraîner un blocage lorsque le transfert A→B verrouille A en premier et que le transfert B→A verrouille B en premier. Il s'agit de l'impasse ABBA classique.</td></tr>
<tr><td>Avancé</td><td>Portée de verrouillage incorrecte</td><td>Protéger uniquement <code translate="no">self.balance</code> ne protège pas <code translate="no">target.balance</code>. Une solution correcte doit verrouiller les deux comptes dans un ordre stable, généralement par ID de compte, ou utiliser un verrou global avec une concurrence plus faible.</td></tr>
</tbody>
</table>
<p>L'invite et le code sont présentés ci-dessous :</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Résultats du débogage du code : GPT-5.5 a donné la réponse la plus complète</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro a donné une analyse concise et est allé directement à la solution du verrou ordonné, qui est la façon standard d'éviter le blocage ABBA. Sa réponse a démontré la bonne solution, mais elle n'a pas passé beaucoup de temps à expliquer pourquoi la solution naïve basée sur les verrous pourrait introduire un nouveau mode de défaillance.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La version GPT-5.5 a obtenu les meilleurs résultats lors de ce test. Il a trouvé les principaux problèmes, anticipé le risque de blocage, expliqué pourquoi le code original pouvait échouer et fourni une implémentation complète corrigée.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B a identifié les bogues avec précision et son exemple de séquence d'exécution était clair. La partie la plus faible était le correctif : il a choisi un verrou global au niveau de la classe, ce qui fait que chaque compte partage le même verrou. Cela fonctionne pour une petite simulation, mais c'est un mauvais compromis pour un système bancaire réel, car les transferts de comptes non liés doivent toujours attendre le même verrou.</p>
<p><strong>En résumé,</strong> GPT-5.5 a non seulement résolu le bogue actuel, mais il a également mis en garde contre le prochain bogue qu'un développeur pourrait introduire. DeepSeek V4-Pro a fourni la correction non GPT la plus propre. Qwen3.6 a trouvé les problèmes et produit un code fonctionnel, mais n'a pas signalé le compromis sur l'évolutivité.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">Quel modèle gère le mieux la recherche en contexte long ?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour le test du contexte long, nous avons utilisé le texte intégral du <em>Rêve de la chambre rouge</em>, soit environ 850 000 caractères chinois. Nous avons inséré un marqueur caché autour de la position 500 000 caractères :</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>Nous avons ensuite téléchargé le fichier sur chaque modèle et lui avons demandé de trouver à la fois le contenu du marqueur et sa position.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Résultats de l'extraction de textes longs : Le modèle GPT-5.5 a trouvé le marqueur avec la plus grande précision</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro a trouvé le marqueur caché, mais n'a pas trouvé la position correcte du caractère. Il a également donné le mauvais contexte environnant. Dans ce test, il a semblé localiser le marqueur de manière sémantique, mais a perdu la trace de la position exacte lors du raisonnement sur le document.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 a correctement trouvé le contenu du marqueur, la position et le contexte environnant. Il a indiqué que la position était 500,002 et a même fait la distinction entre le comptage à indexation zéro et le comptage à indexation unique. Le contexte environnant correspondait également au texte utilisé lors de l'insertion du marqueur.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B a trouvé le contenu du marqueur et le contexte environnant correctement, mais son estimation de la position était erronée.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">Que révèlent ces tests sur la sélection des modèles ?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Les trois tests indiquent un modèle de sélection pratique : <strong>GPT-5.5 est le choix de la capacité, DeepSeek V4-Pro est le choix du coût-performance du contexte long, et Qwen3.6-35B-A3B est le choix du contrôle local.</strong></p>
<table>
<thead>
<tr><th>Modèle</th><th>Meilleure adéquation</th><th>Ce qui s'est passé lors de nos tests</th><th>Principale mise en garde</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Meilleure capacité globale</td><td>A remporté les tests d'extraction en direct, de débogage de la concurrence et de marqueur de contexte long</td><td>Coût plus élevé ; plus performant lorsque la précision et l'utilisation de l'outil justifient le prix.</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Déploiement en contexte long, à moindre coût</td><td>A fourni la meilleure solution non GPT pour le bogue de la concurrence et a trouvé le contenu du marqueur.</td><td>Nécessite des outils d'extraction externes pour les tâches en ligne ; le suivi exact de l'emplacement des caractères était plus faible dans ce test.</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Déploiement local, poids ouverts, entrée multimodale, charges de travail en langue chinoise</td><td>Bons résultats en matière d'identification des bogues et de compréhension des contextes longs</td><td>La qualité des corrections était moins évolutive ; l'accès au web en direct n'était pas disponible dans cette configuration.</td></tr>
</tbody>
</table>
<p>Utilisez GPT-5.5 lorsque vous avez besoin des meilleurs résultats et que le coût est secondaire. Utilisez DeepSeek V4-Pro lorsque vous avez besoin d'un contexte long, d'un coût de service plus faible et d'un déploiement adapté à l'API. Utilisez Qwen3.6-35B-A3B lorsque les poids ouverts, le déploiement privé, la prise en charge multimodale ou le contrôle de la pile de serveurs sont les plus importants.</p>
<p>Pour les applications à forte intensité de recherche, cependant, le choix du modèle ne représente que la moitié de l'histoire. Même un modèle de contexte long solide est plus performant lorsque le contexte est récupéré, filtré et ancré par un <a href="https://zilliz.com/learn/generative-ai">système de recherche sémantique</a> spécialisé.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Pourquoi le RAG est toujours important pour les modèles à contexte long<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fenêtre de contexte long ne supprime pas le besoin de recherche. Elle modifie la stratégie de recherche.</p>
<p>Dans une application RAG, le modèle ne doit pas analyser chaque document à chaque demande. Une <a href="https://zilliz.com/learn/introduction-to-unstructured-data">architecture de base de données vectorielle</a> stocke les enchâssements, recherche les morceaux sémantiquement pertinents, applique des filtres de métadonnées et renvoie un ensemble de contexte compact au modèle. Cela permet au modèle d'obtenir de meilleures données d'entrée tout en réduisant les coûts et le temps de latence.</p>
<p>Milvus joue ce rôle car il gère les <a href="https://milvus.io/docs/schema.md">schémas de collecte</a>, l'indexation vectorielle, les métadonnées scalaires et les opérations d'extraction dans un seul système. Vous pouvez commencer localement avec <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, passer à un <a href="https://milvus.io/docs/quickstart.md">démarrage rapide Milvus</a> autonome, déployer avec une <a href="https://milvus.io/docs/install_standalone-docker.md">installation Docker</a> ou un <a href="https://milvus.io/docs/install_standalone-docker-compose.md">déploiement Docker Compose</a>, et évoluer davantage avec un <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">déploiement Kubernetes</a> lorsque la charge de travail augmente.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Comment construire un pipeline RAG avec Milvus et DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>La procédure suivante permet de construire un petit pipeline RAG en utilisant DeepSeek V4-Pro pour la génération et Milvus pour l'extraction. La même structure s'applique à d'autres LLM : créer des embeddings, les stocker dans une collection, rechercher un contexte pertinent et passer ce contexte dans le modèle.</p>
<p>Pour une présentation plus complète, voir le <a href="https://milvus.io/docs/build-rag-with-milvus.md">tutoriel</a> officiel <a href="https://milvus.io/docs/build-rag-with-milvus.md">de Milvus RAG</a>. Dans cet exemple, le pipeline est réduit afin que le flux d'extraction soit facile à inspecter.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Préparer l'environnement<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Installer les dépendances</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Si vous utilisez Google Colab, vous devrez peut-être redémarrer le runtime après avoir installé les dépendances. Cliquez sur le menu <strong>Runtime</strong>, puis sélectionnez <strong>Restart session (Redémarrer la session)</strong>.</p>
<p>DeepSeek V4-Pro supporte une API de type OpenAI. Connectez-vous au site Web officiel de DeepSeek et définissez <code translate="no">DEEPSEEK_API_KEY</code> comme variable d'environnement.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Préparer l'ensemble de données de la documentation Milvus</h3><p>Nous utilisons les pages FAQ de l'<a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">archive de documentation Milvus 2.4.x</a> comme source de connaissance privée. Il s'agit d'un ensemble de données de départ simple pour une petite démo RAG.</p>
<p>Tout d'abord, téléchargez le fichier ZIP et extrayez la documentation dans le dossier <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Nous chargeons tous les fichiers Markdown du dossier <code translate="no">milvus_docs/en/faq</code>. Pour chaque document, nous divisons le contenu du fichier par <code translate="no">#</code>, qui sépare grosso modo les principales sections Markdown.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Configuration de DeepSeek V4 et du modèle d'intégration</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Ensuite, choisissez un modèle d'intégration. Cet exemple utilise <code translate="no">DefaultEmbeddingFunction</code> du module PyMilvus model. Voir la documentation Milvus pour plus d'informations sur les <a href="https://milvus.io/docs/embeddings.md">fonctions d'intégration</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Générez un vecteur de test, puis imprimez la dimension du vecteur et les premiers éléments. La dimension renvoyée est utilisée lors de la création de la collection Milvus.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Charger des données dans Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Création d'une collection Milvus</h3><p>Une collection Milvus stocke des champs vectoriels, des champs scalaires et des métadonnées dynamiques facultatives. L'installation rapide ci-dessous utilise l'API de haut niveau <code translate="no">MilvusClient</code>; pour les schémas de production, consultez les documents sur la <a href="https://milvus.io/docs/manage-collections.md">gestion des collections</a> et la <a href="https://milvus.io/docs/create-collection.md">création de collections</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Quelques remarques sur <code translate="no">MilvusClient</code>:</p>
<ul>
<li>Configurer <code translate="no">uri</code> dans un fichier local, tel que <code translate="no">./milvus.db</code>, est l'option la plus simple car elle utilise automatiquement <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> et stocke toutes les données dans ce fichier.</li>
<li>Si vous avez un grand ensemble de données, vous pouvez configurer un serveur Milvus plus performant sur <a href="https://milvus.io/docs/quickstart.md">Docker ou Kubernetes</a>. Dans cette configuration, utilisez l'URI du serveur, par exemple <code translate="no">http://localhost:19530</code>, comme votre <code translate="no">uri</code>.</li>
<li>Si vous souhaitez utiliser <a href="https://docs.zilliz.com/">Zilliz Cloud</a>, le service cloud entièrement géré pour Milvus, définissez <code translate="no">uri</code> et <code translate="no">token</code> sur le <a href="https://docs.zilliz.com/docs/connect-to-cluster">point de terminaison public et la clé API de</a> Zilliz Cloud.</li>
</ul>
<p>Vérifier si la collection existe déjà. Si c'est le cas, supprimez-la.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Créez une nouvelle collection avec les paramètres spécifiés. Si nous ne spécifions pas d'informations sur les champs, Milvus crée automatiquement un champ <code translate="no">id</code> par défaut comme clé primaire et un champ vectoriel pour stocker les données vectorielles. Un champ JSON réservé stocke les données scalaires qui ne sont pas définies dans le schéma.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>La métrique <code translate="no">IP</code> désigne la similarité du produit intérieur. Milvus prend également en charge d'autres types de métriques et choix d'index en fonction du type de vecteur et de la charge de travail ; voir les guides sur les <a href="https://milvus.io/docs/id/metric.md">types de métriques</a> et la <a href="https://milvus.io/docs/index_selection.md">sélection d'index</a>. Le paramètre <code translate="no">Strong</code> est l'un des <a href="https://milvus.io/docs/consistency.md">niveaux de cohérence</a> disponibles.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Insérer les documents incorporés</h3><p>Interrogez les données textuelles, créez des enchâssements et insérez les données dans Milvus. Ici, nous ajoutons un nouveau champ nommé <code translate="no">text</code>. Comme il n'est pas explicitement défini dans le schéma de la collection, il est automatiquement ajouté au champ JSON dynamique réservé. Pour les métadonnées de production, consultez la <a href="https://milvus.io/docs/enable-dynamic-field.md">prise en charge des champs dynamiques</a> et la <a href="https://milvus.io/docs/json-field-overview.md">présentation des champs JSON</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Pour les ensembles de données plus importants, le même modèle peut être étendu avec une conception explicite du schéma, des <a href="https://milvus.io/docs/index-vector-fields.md">index de champs vectoriels</a>, des index scalaires et des opérations de cycle de vie des données telles que l'<a href="https://milvus.io/docs/insert-update-delete.md">insertion, l'insertion ascendante et la suppression</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Construire le flux de recherche RAG<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Recherche du contexte pertinent dans Milvus</h3><p>Définissons une question courante sur Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Recherchez la question dans la collection et récupérez les trois meilleures correspondances sémantiques. Il s'agit d'une <a href="https://milvus.io/docs/single-vector-search.md">recherche de</a> base <a href="https://milvus.io/docs/single-vector-search.md">à vecteur unique</a>. En production, vous pouvez la combiner avec la <a href="https://milvus.io/docs/filtered-search.md">recherche filtrée</a>, la <a href="https://milvus.io/docs/full-text-search.md">recherche en texte intégral</a>, la <a href="https://milvus.io/docs/multi-vector-search.md">recherche hybride multi-vecteur</a> et les <a href="https://milvus.io/docs/reranking.md">stratégies de reclassement</a> pour améliorer la pertinence.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Examinons maintenant les résultats de la recherche pour la requête.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Générer une réponse RAG avec DeepSeek V4</h3><p>Convertir les documents récupérés en format chaîne de caractères.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Définir les messages-guides du système et de l'utilisateur pour le LLM. Ce message-guide est assemblé à partir des documents extraits de Milvus.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Utiliser le modèle fourni par DeepSeek V4-Pro pour générer une réponse basée sur l'invite.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>À ce stade, le pipeline a terminé la boucle principale de RAG : intégrer les documents, stocker les vecteurs dans Milvus, rechercher le contexte pertinent et générer une réponse avec DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">Que devriez-vous améliorer avant la production ?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La démo utilise un simple découpage de section et une recherche top-k. C'est suffisant pour montrer les mécanismes, mais le RAG de production a généralement besoin d'un plus grand contrôle de la recherche.</p>
<table>
<thead>
<tr><th>Besoin de production</th><th>Fonctionnalité de Milvus à prendre en compte</th><th>Pourquoi c'est utile</th></tr>
</thead>
<tbody>
<tr><td>Mélange de signaux sémantiques et de mots-clés</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Recherche hybride avec Milvus</a></td><td>Combine la recherche vectorielle dense avec des signaux épars ou en texte intégral</td></tr>
<tr><td>Fusionner les résultats de plusieurs extracteurs</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Extracteur de recherche hybride Milvus</a></td><td>Permet aux flux de travail LangChain d'utiliser un classement pondéré ou de type RRF</td></tr>
<tr><td>Restriction des résultats par locataire, horodatage ou type de document</td><td>Filtres de métadonnées et filtres scalaires</td><td>Permet de limiter la recherche à la bonne tranche de données</td></tr>
<tr><td>Passer d'une gestion autonome de Milvus à un service géré</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Migration de Milvus vers Zilliz</a></td><td>Réduit le travail d'infrastructure tout en conservant la compatibilité avec Milvus</td></tr>
<tr><td>Connexion sécurisée aux applications hébergées</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Clés API du nuage Zilliz</a></td><td>Contrôle d'accès basé sur des jetons pour les clients des applications</td></tr>
</tbody>
</table>
<p>L'habitude de production la plus importante consiste à évaluer la récupération séparément de la génération. Si le contexte récupéré est faible, l'échange de LLM masque souvent le problème au lieu de le résoudre.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Démarrer avec Milvus et DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous souhaitez reproduire le tutoriel, commencez par consulter la <a href="https://milvus.io/docs">documentation</a> officielle <a href="https://milvus.io/docs">de Milvus</a> et le <a href="https://milvus.io/docs/build-rag-with-milvus.md">guide Build RAG with Milvus</a>. Pour une configuration gérée, <a href="https://docs.zilliz.com/docs/connect-to-cluster">connectez-vous à Zilliz Cloud</a> avec votre point de terminaison de cluster et votre clé API au lieu d'exécuter Milvus localement.</p>
<p>Si vous souhaitez obtenir de l'aide pour optimiser le regroupement, l'indexation, les filtres ou la recherche hybride, rejoignez la <a href="https://slack.milvus.io/">communauté Slack de Milvus</a> ou réservez une <a href="https://milvus.io/office-hours">session Milvus Office Hours</a> gratuite. Si vous préférez ignorer la configuration de l'infrastructure, utilisez le <a href="https://cloud.zilliz.com/login">login Zilliz Cloud</a> ou créez un <a href="https://cloud.zilliz.com/signup">compte Zilliz Cloud</a> pour exécuter Milvus géré.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Questions posées par les développeurs sur DeepSeek V4, Milvus et RAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">DeepSeek V4 est-il bon pour RAG ?</h3><p>DeepSeek V4-Pro convient parfaitement à RAG lorsque vous avez besoin d'un traitement de contexte long et d'un coût de service inférieur à celui des modèles fermés haut de gamme. Vous avez toujours besoin d'une couche d'extraction telle que Milvus pour sélectionner les morceaux pertinents, appliquer des filtres de métadonnées et garder l'invite ciblée.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">Dois-je utiliser GPT-5.5 ou DeepSeek V4 pour un pipeline RAG ?</h3><p>Utilisez GPT-5.5 lorsque la qualité de la réponse, l'utilisation de l'outil et la recherche en direct sont plus importantes que le coût. Utilisez DeepSeek V4-Pro lorsque le traitement du contexte long et le contrôle des coûts sont plus importants, en particulier si votre couche d'extraction fournit déjà un contexte de base de haute qualité.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Puis-je exécuter Qwen3.6-35B-A3B localement pour un RAG privé ?</h3><p>Oui, Qwen3.6-35B-A3B est un poids ouvert conçu pour un déploiement plus contrôlable. C'est un bon candidat lorsque la confidentialité, le service local, l'entrée multimodale ou les performances en langue chinoise sont importants, mais vous devez toujours valider la latence, la mémoire et la qualité d'extraction pour votre matériel.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">Les modèles à contexte long rendent-ils les bases de données vectorielles inutiles ?</h3><p>Non. Les modèles à contexte long peuvent lire plus de texte, mais ils bénéficient toujours de la récupération. Une base de données vectorielle réduit l'entrée aux morceaux pertinents, prend en charge le filtrage des métadonnées, réduit le coût des jetons et facilite la mise à jour de l'application au fur et à mesure que les documents changent.</p>
