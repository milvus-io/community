---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Partilha técnica:Aplicar alterações de configuração no Milvus 2.0 utilizando o
  Docker Compose
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Saiba como aplicar alterações de configuração no Milvus 2.0
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Partilha técnica: Aplicar alterações de configuração no Milvus 2.0 usando o Docker Compose</custom-h1><p><em>Jingjing Jia, Engenheira de Dados da Zilliz, licenciou-se em Ciências da Computação na Universidade de Xi'an Jiaotong. Depois de se juntar à Zilliz, trabalha principalmente no pré-processamento de dados, implementação de modelos de IA, investigação de tecnologias relacionadas com o Milvus e ajuda os utilizadores da comunidade a implementar cenários de aplicação. É muito paciente, gosta de comunicar com os parceiros da comunidade e gosta de ouvir música e ver anime.</em></p>
<p>Como utilizador frequente do Milvus, fiquei muito entusiasmado com o recém-lançado Milvus 2.0 RC. De acordo com a introdução no site oficial, o Milvus 2.0 parece superar os seus antecessores por uma grande margem. Estava ansioso por o experimentar.</p>
<p>E experimentei.  No entanto, quando realmente pus as mãos no Milvus 2.0, percebi que não era capaz de modificar o ficheiro de configuração no Milvus 2.0 tão facilmente como fazia com o Milvus 1.1.1. Não conseguia alterar o ficheiro de configuração dentro do contentor Docker do Milvus 2.0 iniciado com o Docker Compose, e mesmo uma alteração forçada não tinha efeito. Mais tarde, descobri que o Milvus 2.0 RC não conseguia detetar alterações no ficheiro de configuração após a instalação. E a futura versão estável corrigirá esse problema.</p>
<p>Depois de ter tentado diferentes abordagens, encontrei uma forma fiável de aplicar alterações aos ficheiros de configuração para o Milvus 2.0 standalone &amp; cluster, e aqui está como.</p>
<p>Observe que todas as alterações na configuração devem ser feitas antes de reiniciar o Milvus usando o Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Modificar o ficheiro de configuração em Milvus standalone<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Primeiro, terá de <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">descarregar</a> uma cópia do ficheiro <strong>milvus.yaml</strong> para o seu dispositivo local.</p>
<p>Em seguida, pode alterar as configurações no ficheiro. Por exemplo, pode alterar o formato do registo como <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>Assim que o ficheiro milvus <strong>.yaml</strong> for modificado, também terá de <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">descarregar</a> e modificar o ficheiro <strong>docker-compose.yaml</strong> para o standalone, mapeando o caminho local para milvus.yaml para o caminho correspondente do contentor docker para o ficheiro de configuração <code translate="no">/milvus/configs/milvus.yaml</code> na secção <code translate="no">volumes</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>Por fim, inicie o Milvus standalone usando <code translate="no">docker-compose up -d</code> e verifique se as modificações foram bem-sucedidas. Por exemplo, execute <code translate="no">docker logs</code> para verificar o formato do registo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Modificar o ficheiro de configuração no cluster do Milvus<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Primeiro, faça <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">o download</a> e modifique o arquivo <strong>milvus.yaml</strong> para atender às suas necessidades.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>Em seguida, você precisará <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">baixar</a> e modificar o arquivo <strong>docker-compose.yml</strong> do cluster mapeando o caminho local para <strong>milvus.yaml</strong> no caminho correspondente para os arquivos de configuração em todos os componentes, ou seja, coordenada raiz, coordenada de dados, nó de dados, coordenada de consulta, nó de consulta, coordenada de índice, nó de índice e proxy.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>Finalmente, pode iniciar o cluster Milvus utilizando <code translate="no">docker-compose up -d</code> e verificar se as modificações foram bem sucedidas.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Alterar o caminho do ficheiro de registo no ficheiro de configuração<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>Primeiro, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">transfira</a> o ficheiro <strong>milvus.yaml</strong> e altere a secção <code translate="no">rootPath</code> como o diretório onde espera armazenar os ficheiros de registo no contentor Docker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>Depois disso, descarregue o ficheiro <strong>docker-compose.yml</strong> correspondente para Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">autónomo</a> ou <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a>.</p>
<p>Para o modo autónomo, é necessário mapear o caminho local para <strong>milvus.yaml</strong> para o caminho correspondente do contentor Docker para o ficheiro de configuração <code translate="no">/milvus/configs/milvus.yaml</code> e mapear o diretório do ficheiro de registo local para o diretório do contentor Docker criado anteriormente.</p>
<p>Para o cluster, terá de mapear ambos os caminhos em cada componente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>Por fim, inicie o Milvus standalone ou o cluster utilizando <code translate="no">docker-compose up -d</code> e verifique os ficheiros de registo para ver se a modificação foi bem sucedida.</p>
