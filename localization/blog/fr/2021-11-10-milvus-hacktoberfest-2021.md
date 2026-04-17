---
id: 2021-11-10-milvus-hacktoberfest-2021.md
title: C'est terminé ! Milvus Hacktoberfest 2021
author: Zilliz
date: 2021-11-10T00:00:00.000Z
desc: Merci à tous ceux qui ont participé à la Milvus Hacktoberfest 2021 !
cover: assets.zilliz.com/It_s_a_wrap_9c0b9f0b38.png
tag: Events
---
<custom-h1>C'est terminé - Milvus Hacktoberfest 2021</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_cover_a6ce8748d7.jpeg" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Le Hacktoberfest est terminé, mais il n'y a pas de fin à la contribution aux projets open-source !</p>
<p>Tout au long du mois d'octobre, nous avons reçu un total de <strong>44 pull requests</strong> (PRs) à travers nos dépôts de la part de <strong>36 contributeurs</strong> (à l'exclusion de notre équipe principale). Bien que ce soit la première année que la communauté Milvus participe à Hacktoberfest, le nombre de participants que nous avons vu était au-delà de nos attentes, une indication de la prise de conscience croissante de l'esprit open-source.</p>
<p>Nous espérons que tous ceux qui ont participé à cet événement ont acquis une expérience pratique ou une connaissance de l'open source, de la communauté et des compétences techniques utiles dans le processus.️️️</p>
<p>Dans ce billet, nous aimerions vous inviter à célébrer nos réalisations ensemble et comment continuer à contribuer à Milvus après Hacktoberfest.</p>
<h2 id="📣-Shout-out-to-our-contributors" class="common-anchor-header"><strong>📣 Coup de chapeau à nos contributeurs :</strong><button data-href="#📣-Shout-out-to-our-contributors" class="anchor-icon" translate="no">
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
    </button></h2><p>Pendant le Hacktoberfest de cette année, les dépôts du projet Milvus ont vu <strong>44 pull requests fusionnées</strong>! C'est un énorme accomplissement de tous les côtés. Bon travail à tous ! 🎉</p>
<p><a href="https://github.com/parthiv11">parthiv11</a>, <a href="https://github.com/joremysh">joremysh</a>, <a href="https://github.com/noviicee">noviicee</a>, <a href="https://github.com/Biki-das">Biki-das</a>, <a href="https://github.com/Nadyamilona">Nadyamilona</a>, <a href="https://github.com/ashish4arora">ashish4arora</a>, <a href="https://github.com/Dhruvacube">Dhruvacube</a>, <a href="https://github.com/iamartyaa">iamartyaa</a>, <a href="https://github.com/RafaelDSS">RafaelDSS</a>, <a href="https://github.com/kartikcho">kartikcho</a>, <a href="https://github.com/GuyKh">GuyKh</a>, <a href="https://github.com/Deep1Shikha">Deep1Shikha</a>, <a href="https://github.com/shreemaan-abhishek">shreemaan-abhishek</a>, <a href="https://github.com/daniel-shuy">daniel-shuy</a>, <a href="https://github.com/Hard-Coder05">Hard-Coder05</a>, <a href="https://github.com/sapora1">sapora1</a>, <a href="https://github.com/Rutam21">Rutam21</a>, <a href="https://github.com/idivyanshbansal">idivyanshbansal</a>, <a href="https://github.com/Mihir501">Mihir501</a>, <a href="https://github.com/Ayushchaudhary-Github">YushChaudhary</a>, <a href="https://github.com/sreyan-ghosh">sreyan-ghosh</a>, <a href="https://github.com/chiaramistro">chiaramistro</a>, <a href="https://github.com/appledora">appledora</a>, <a href="https://github.com/luisAzcuaga">luisAzcuaga</a>, <a href="https://github.com/matteomessmer">matteomessmer</a>, <a href="https://github.com/Nadyamilona">Nadyamilona</a>, <a href="https://github.com/Tititesouris">Tititesouris</a>, <a href="https://github.com/amusfq">amusfq</a>, <a href="https://github.com/matrixji">matrixji</a> &amp; <a href="https://github.com/zamanmub">généralZman</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/_80b0d87746.png" alt="image-20211110180357460" class="doc-image" id="image-20211110180357460" />
   </span> <span class="img-wrapper"> <span>image-20211110180357460</span> </span></p>
<h3 id="Here-are-some-extraordinary-Milvus-Hacktoberfest-2021-contributions" class="common-anchor-header">Voici quelques contributions extraordinaires du Milvus Hacktoberfest 2021 :</h3><p><strong>⚙️ Nouvelles fonctionnalités</strong></p>
<p><a href="https://github.com/milvus-io/milvus/issues/7706">Compiler et exécuter Milvus sur plusieurs plateformes</a> par <a href="https://github.com/matrixji">matrixji</a></p>
<p><strong>(🏆 Top Contributor 🏆 )</strong></p>
<p><strong>📝 Documentation</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/issues/720">Traduire Hello Milvus (example_code.md) dans n'importe quelle langue</a> par <a href="https://github.com/chiaramistro">chiaramistro</a>, <a href="https://github.com/appledora">appledora</a>, <a href="https://github.com/luisAzcuaga">luisAzcuaga</a>, <a href="https://github.com/matteomessmer">matteomessmer</a>, <a href="https://github.com/Nadyamilona">Nadyamilona</a>, <a href="https://github.com/Tititesouris">Tititesouris</a> &amp; <a href="https://github.com/amusfq">amusfq</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/issues/720">Ajout d'un exemple NodeJS à example_code.md</a> par <a href="https://github.com/GuyKh">GuyKh</a></li>
<li><a href="https://github.com/milvus-io/milvus-docs/pull/921/files">Traduction de upgrade.md</a> et <a href="https://github.com/milvus-io/milvus-docs/pull/892">ajout et traduction de paramètres dans le guide de l'utilisateur vers CN</a> par <a href="https://github.com/joremysh">joremysh</a></li>
<li><a href="https://github.com/milvus-io/milvus-docs/pull/752">Traduire</a><a href="https://github.com/milvus-io/milvus-docs/pull/753">tutorials/dna_sequence_classification.md en CN</a> &amp; <a href="https://github.com/milvus-io/milvus-docs/pull/752">Traduire reference/schema/collection_schema.md en CN</a> par <a href="https://github.com/daniel-shuy">daniel-shuy</a></li>
</ul>
<p><strong>🚀 Bootcamp</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/pull/858">Amélioration du tutoriel Jupyter Notebook pour la recherche de hachage d'images </a>par <a href="https://github.com/zamanmub">generalZman</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/pull/792">Correction du bogue TOPK de reverse_image_search</a> par <a href="https://github.com/RafaelDSS">RafaelDSS</a></li>
</ul>
<p><strong>🐍 PyMilvus</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/pymilvus/issues/741">Mise à jour des formulaires de problèmes GitHub </a>(plusieurs dépôts) par <a href="https://github.com/Hard-Coder05">Hard-Coder05</a></li>
</ul>
<h3 id="Share-your-feedback-with-us" class="common-anchor-header">Faites-nous part de vos commentaires !</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h3_412b0f649b.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Vous êtes les bienvenus pour partager votre expérience du Milvus Hacktoberfest 2021 avec nous ! Qu'il s'agisse d'un article de blog, d'un tweet (@milvusio) ou simplement d'un message sur notre <a href="https://discuss.milvus.io/c/hacktoberfest/9">forum</a>, tout sera grandement apprécié !</p>
<h2 id="Whats-Next" class="common-anchor-header">Prochaines étapes？<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="👩‍💻-Code--Documentation" class="common-anchor-header"><strong>👩‍💻</strong> <strong>Code et documentation</strong></h3><p>Si vous avez une connaissance limitée de Milvus, vous pouvez vous familiariser avec le fonctionnement de la communauté en contribuant aux dépôts <a href="https://github.com/milvus-io/pymilvus">pymilvus</a> ou <a href="https://github.com/milvus-io/milvus-docs">docs</a>. Vous pouvez également rechercher des tags tels que <strong>#goodfirsttissue</strong> ou <strong>#helpwanted</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h4_f18c9b6c2c.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h5_a4f90c24a8.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Si vous avez des questions sur la contribution, vous pouvez toujours les poser à la communauté dans la catégorie <strong>Contributeur</strong> du Forum : https://discuss.milvus.io/t/things-you-need-to-know-before-you-get-started/64.</p>
<h3 id="🏆-Be-a-Milvus-Advocate" class="common-anchor-header">🏆 Soyez un défenseur de Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/advocate_1052d8249a.jpg" alt="image-20211110180730866" class="doc-image" id="image-20211110180730866" />
   </span> <span class="img-wrapper"> <span>image-20211110180730866</span> </span></p>
<p>Partagez votre expérience et les choses que vous avez apprises avec la communauté；proposez des idées sur la façon dont nous pouvons nous améliorer ; répondez aux questions et aidez les autres sur le forum Milvus, etc. Il existe de nombreuses façons de participer à la communauté. Nous avons listé quelques exemples ci-dessous, mais toutes les formes de contribution sont les bienvenues :</p>
<ul>
<li><p><strong>Démonstrations et solutions :</strong> Montrez aux utilisateurs de Milvus comment exploiter la plate-forme dans des scénarios spécifiques (par exemple, un système de recommandation musicale). Des exemples sont disponibles dans le <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</p></li>
<li><p><strong>Articles de blog, récits d'utilisateurs ou livres blancs :</strong> Rédiger un contenu de haute qualité qui explique clairement et précisément les détails techniques de Milvus.</p></li>
<li><p><strong>Conférences techniques/émissions en direct :</strong> Donner des conférences ou animer des émissions en direct qui contribuent à faire connaître Milvus.</p></li>
<li><p><strong>Autres :</strong> Tout contenu jouant un rôle positif dans le développement de Milvus et de sa communauté open-source sera considéré comme éligible.</p></li>
</ul>
<p>Pour plus de détails, veuillez consulter : https://milvus.io/community/milvus_advocate.md</p>
<p>Enfin, merci encore d'avoir participé au Hacktoberfest de cette année avec nous et de nous avoir permis d'être vos mentors et vos étudiants. Merci à <a href="https://hacktoberfest.digitalocean.com/">Digital Ocean</a> d'avoir accueilli cette année encore cet événement extraordinaire. Jusqu'à la prochaine fois !</p>
<p>Bon codage !</p>
<p>L'équipe de la communauté Milvus</p>
