---
id: building-video-search-system-with-milvus.md
title: Descrição geral do sistema
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Pesquisa de vídeos por imagem com o Milvus
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 passos para criar um sistema de pesquisa de vídeo</custom-h1><p>Como o próprio nome sugere, a pesquisa de vídeos por imagem é o processo de recuperar do repositório vídeos que contêm fotogramas semelhantes à imagem de entrada. Um dos principais passos é transformar os vídeos em embeddings, ou seja, extrair os fotogramas chave e converter as suas caraterísticas em vectores. Agora, alguns leitores curiosos podem perguntar-se qual é a diferença entre procurar um vídeo por imagem e procurar uma imagem por imagem? De facto, a pesquisa de fotogramas-chave em vídeos é equivalente à pesquisa de uma imagem por imagem.</p>
<p>Se estiver interessado, pode consultar o nosso artigo anterior <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: Construir um sistema de recuperação de imagens baseado em conteúdos</a>.</p>
<h2 id="System-overview" class="common-anchor-header">Descrição geral do sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>O diagrama seguinte ilustra o fluxo de trabalho típico de um sistema de pesquisa de vídeo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-video-search-system-workflow.png</span> </span></p>
<p>Ao importar vídeos, utilizamos a biblioteca OpenCV para cortar cada vídeo em fotogramas, extrair vectores dos fotogramas chave utilizando o modelo de extração de caraterísticas de imagem VGG e, em seguida, inserir os vectores extraídos (embeddings) no Milvus. Utilizamos o Minio para armazenar os vídeos originais e o Redis para armazenar as correlações entre os vídeos e os vectores.</p>
<p>Na pesquisa de vídeos, utilizamos o mesmo modelo VGG para converter a imagem de entrada num vetor de caraterísticas e inseri-lo no Milvus para encontrar os vectores com maior semelhança. Em seguida, o sistema recupera os vídeos correspondentes do Minio na sua interface, de acordo com as correlações no Redis.</p>
<h2 id="Data-preparation" class="common-anchor-header">Preparação dos dados<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Neste artigo, utilizamos cerca de 100.000 ficheiros GIF do Tumblr como exemplo de conjunto de dados para criar uma solução completa de pesquisa de vídeo. Pode utilizar os seus próprios repositórios de vídeo.</p>
<h2 id="Deployment" class="common-anchor-header">Implementação<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>O código para criar o sistema de recuperação de vídeo neste artigo está no GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Etapa 1: criar imagens do Docker.</h3><p>O sistema de recuperação de vídeo requer a janela de encaixe Milvus v0.7.1, a janela de encaixe Redis, a janela de encaixe Minio, a janela de encaixe da interface de front-end e a janela de encaixe da API de back-end. É necessário criar a janela de encaixe da interface de front-end e a janela de encaixe da API de back-end por si próprio, enquanto pode obter as outras três janelas de encaixe diretamente do Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Etapa 2: configurar o ambiente.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Aqui usamos o docker-compose.yml para gerenciar os cinco contêineres mencionados acima. Veja a tabela a seguir para a configuração do docker-compose.yml:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>O endereço IP 192.168.1.38 na tabela acima é o endereço do servidor especialmente para a criação do sistema de recuperação de vídeo neste artigo. É necessário actualizá-lo para o seu endereço de servidor.</p>
<p>É necessário criar manualmente diretórios de armazenamento para Milvus, Redis e Minio e, em seguida, adicionar os caminhos correspondentes em docker-compose.yml. Neste exemplo, criamos os seguintes diretórios:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>Você pode configurar o Milvus, o Redis e o Minio no docker-compose.yml da seguinte forma:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Etapa 3: iniciar o sistema.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Use o docker-compose.yml modificado para iniciar os cinco contêineres docker a serem usados no sistema de recuperação de vídeo:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>Em seguida, pode executar o docker-compose ps para verificar se os cinco contentores de ancoragem arrancaram corretamente. A seguinte captura de ecrã mostra uma interface típica após um arranque bem-sucedido.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-sucessful-setup.png</span> </span></p>
<p>Agora, você construiu com sucesso um sistema de pesquisa de vídeo, embora o banco de dados não tenha vídeos.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Etapa 4: Importar vídeos.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>No diretório de implantação do repositório do sistema, encontra-se import_data.py, script para importar vídeos. Só precisa de atualizar o caminho para os ficheiros de vídeo e o intervalo de importação para executar o script.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-update-path-video.png</span> </span></p>
<p>data_path: O caminho para os vídeos a importar.</p>
<p>time.sleep(0.5): O intervalo em que o sistema importa os vídeos. O servidor que usamos para construir o sistema de busca de vídeos tem 96 núcleos de CPU. Portanto, é recomendável definir o intervalo como 0,5 segundo. Defina o intervalo para um valor maior se o seu servidor tiver menos núcleos de CPU. Caso contrário, o processo de importação sobrecarregará a CPU e criará processos zumbis.</p>
<p>Execute import_data.py para importar vídeos.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>Uma vez importados os vídeos, está tudo pronto com o seu próprio sistema de pesquisa de vídeos!</p>
<h2 id="Interface-display" class="common-anchor-header">Exibição da interface<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Abra o seu browser e introduza 192.168.1.38:8001 para ver a interface do sistema de pesquisa de vídeo, como se mostra abaixo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-video-search-interface.png</span> </span></p>
<p>Accione o botão de engrenagem no canto superior direito para ver todos os vídeos no repositório.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-view-all-videos-repository.png</span> </span></p>
<p>Clique na caixa de carregamento no canto superior esquerdo para introduzir uma imagem de destino. Como se mostra abaixo, o sistema devolve vídeos que contêm os fotogramas mais semelhantes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-gozar-recomendador-sistema-gatos.png</span> </span></p>
<p>A seguir, divirta-se com o nosso sistema de pesquisa de vídeos!</p>
<h2 id="Build-your-own" class="common-anchor-header">Construa o seu próprio sistema<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Neste artigo, usámos o Milvus para construir um sistema de pesquisa de vídeos por imagens. Isto exemplifica a aplicação do Milvus no processamento de dados não estruturados.</p>
<p>O Milvus é compatível com várias estruturas de aprendizagem profunda e possibilita pesquisas em milissegundos para vectores à escala de milhares de milhões. Não hesite em levar o Milvus consigo para mais cenários de IA: https://github.com/milvus-io/milvus.</p>
<p>Não seja um estranho, siga-nos no <a href="https://twitter.com/milvusio/">Twitter</a> ou junte-se a nós no <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>! 👇🏻</p>
