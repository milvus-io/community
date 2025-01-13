---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Technical Sharing:Appliquer des changements de configuration sur Milvus 2.0 en
  utilisant Docker Compose
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Apprendre à appliquer les changements de configuration sur Milvus 2.0
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Partage technique : Appliquer des changements de configuration sur Milvus 2.0 à l'aide de Docker Compose</custom-h1><p><em>Jingjing Jia, ingénieur de données chez Zilliz, est diplômée en informatique de l'université Xi'an Jiaotong. Depuis qu'elle a rejoint Zilliz, elle travaille principalement sur le prétraitement des données, le déploiement de modèles d'IA, la recherche sur les technologies liées à Milvus et l'aide aux utilisateurs de la communauté pour mettre en œuvre des scénarios d'application. Elle est très patiente, aime communiquer avec les partenaires de la communauté et aime écouter de la musique et regarder des dessins animés.</em></p>
<p>En tant qu'utilisateur fréquent de Milvus, j'étais très enthousiaste à l'idée de la nouvelle version de Milvus 2.0 RC. D'après l'introduction sur le site officiel, Milvus 2.0 semble surpasser de loin ses prédécesseurs. J'étais impatient de l'essayer moi-même.</p>
<p>Et c'est ce que j'ai fait.  Cependant, lorsque j'ai réellement mis la main sur Milvus 2.0, j'ai réalisé que je n'étais pas en mesure de modifier le fichier de configuration dans Milvus 2.0 aussi facilement que je l'avais fait avec Milvus 1.1.1. Je ne pouvais pas modifier le fichier de configuration à l'intérieur du conteneur Docker de Milvus 2.0 démarré avec Docker Compose, et même une modification forcée ne prenait pas effet. Plus tard, j'ai appris que Milvus 2.0 RC n'était pas en mesure de détecter les modifications apportées au fichier de configuration après l'installation. La prochaine version stable corrigera ce problème.</p>
<p>Après avoir essayé différentes approches, j'ai trouvé un moyen fiable d'appliquer des modifications aux fichiers de configuration pour Milvus 2.0 standalone &amp; cluster, et voici comment.</p>
<p>Notez que toutes les modifications apportées à la configuration doivent être effectuées avant de redémarrer Milvus à l'aide de Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Modifier le fichier de configuration dans Milvus autonome<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Tout d'abord, vous devrez <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">télécharger</a> une copie du fichier <strong>milvus.yaml</strong> sur votre périphérique local.</p>
<p>Ensuite, vous pouvez modifier les configurations dans le fichier. Par exemple, vous pouvez modifier le format du journal comme suit : <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>Une fois le fichier <strong>milvus.y</strong> aml modifié, vous devrez également <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">télécharger</a> et modifier le fichier <strong>docker-compose.yaml</strong> pour le mode autonome en faisant correspondre le chemin d'accès local à milvus.yaml au chemin d'accès correspondant du conteneur docker au fichier de configuration <code translate="no">/milvus/configs/milvus.yaml</code> dans la section <code translate="no">volumes</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>Enfin, démarrez Milvus standalone à l'aide de <code translate="no">docker-compose up -d</code> et vérifiez si les modifications sont réussies. Par exemple, exécutez <code translate="no">docker logs</code> pour vérifier le format du journal.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Modifier le fichier de configuration dans le cluster Milvus<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Tout d'abord, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">téléchargez</a> et modifiez le fichier <strong>milvus.yaml</strong> en fonction de vos besoins.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>Ensuite, vous devrez <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">télécharger</a> et modifier le fichier <strong>docker-compose.yml</strong> du cluster en faisant correspondre le chemin local vers <strong>milvus.yaml</strong> au chemin correspondant aux fichiers de configuration de tous les composants, c'est-à-dire root coord, data coord, data node, query coord, query node, index coord, index node et proxy.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 </span>. <span class="img-wrapper"> <span>png</span> </span></p>
<p>Enfin, vous pouvez démarrer le cluster Milvus à l'aide de <code translate="no">docker-compose up -d</code> et vérifier si les modifications ont été effectuées avec succès.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Modifier le chemin du fichier journal dans le fichier de configuration<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>Tout d'abord, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">téléchargez</a> le fichier <strong>milvus.yaml</strong> et modifiez la section <code translate="no">rootPath</code> en indiquant le répertoire dans lequel vous souhaitez stocker les fichiers journaux dans le conteneur Docker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>Ensuite, téléchargez le fichier <strong>docker-compose.yml</strong> correspondant pour Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">standalone</a> ou <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a>.</p>
<p>Pour le mode autonome, vous devez faire correspondre le chemin local vers <strong>milvus.yaml</strong> au chemin correspondant du conteneur Docker vers le fichier de configuration <code translate="no">/milvus/configs/milvus.yaml</code>, et faire correspondre le répertoire du fichier journal local au répertoire du conteneur Docker que vous avez créé précédemment.</p>
<p>Pour les clusters, vous devrez mapper les deux chemins dans chaque composant.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>Enfin, démarrez Milvus standalone ou cluster à l'aide de <code translate="no">docker-compose up -d</code> et vérifiez les fichiers journaux pour voir si la modification est réussie.</p>
