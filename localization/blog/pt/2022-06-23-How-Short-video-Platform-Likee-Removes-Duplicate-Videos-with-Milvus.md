---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: Como a plataforma de vídeos curtos Likee remove vídeos duplicados com Milvus
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: >-
  Saiba como o Likee usa o Milvus para identificar vídeos duplicados em
  milissegundos.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por Xinyang Guo e Baoyu Han, engenheiros da BIGO, e traduzido por <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p><a href="https://www.bigo.sg/">A BIGO Technology</a> (BIGO) é uma das empresas tecnológicas de Singapura com crescimento mais rápido. Alimentados por tecnologia de inteligência artificial, os produtos e serviços baseados em vídeo da BIGO ganharam imensa popularidade em todo o mundo, com mais de 400 milhões de utilizadores em mais de 150 países. Estes incluem o <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (transmissão em direto) e <a href="https://likee.video/">o Likee</a> (vídeo de curta duração).</p>
<p>O Likee é uma plataforma global de criação de vídeos curtos onde os utilizadores podem partilhar os seus momentos, expressar-se e ligar-se ao mundo. Para melhorar a experiência do utilizador e recomendar-lhe conteúdos de maior qualidade, o Likee tem de eliminar os vídeos duplicados de uma enorme quantidade de vídeos gerados pelos utilizadores todos os dias, o que não é uma tarefa fácil.</p>
<p>Este blogue apresenta a forma como o BIGO utiliza <a href="https://milvus.io">o Milvus</a>, uma base de dados vetorial de código aberto, para remover eficazmente os vídeos duplicados.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#Overview">Visão geral</a></li>
<li><a href="#Video-deduplication-workflow">Fluxo de trabalho de deduplicação de vídeo</a></li>
<li><a href="#System-architecture">Arquitetura do sistema</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Utilização do Milvus para potenciar a pesquisa de semelhanças</a></li>
</ul>
<custom-h1>Descrição geral</custom-h1><p>O Milvus é um banco de dados vetorial de código aberto que oferece pesquisa vetorial ultra-rápida. Com o Milvus, o Likee é capaz de concluir uma pesquisa em 200 ms, garantindo uma alta taxa de recuperação. Entretanto, ao <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">escalar o Milvus horizontalmente</a>, o Likee aumenta com sucesso o rendimento das consultas vectoriais, melhorando ainda mais a sua eficiência.</p>
<custom-h1>Fluxo de trabalho de desduplicação de vídeo</custom-h1><p>Como é que o Likee identifica vídeos duplicados? Sempre que um vídeo de consulta é introduzido no sistema do Likee, é cortado em 15-20 fotogramas e cada fotograma é convertido num vetor de caraterísticas. Em seguida, o Likee pesquisa numa base de dados de 700 milhões de vectores para encontrar os K vectores mais semelhantes. Cada um dos K vectores de topo corresponde a um vídeo da base de dados. O Likee efectua ainda pesquisas refinadas para obter os resultados finais e determinar os vídeos a remover.</p>
<custom-h1>Arquitetura do sistema</custom-h1><p>Vejamos em pormenor como funciona o sistema de desduplicação de vídeos do Likee utilizando o Milvus. Como se mostra no diagrama abaixo, os novos vídeos carregados no Likee serão escritos no Kafka, um sistema de armazenamento de dados, em tempo real e consumidos pelos consumidores do Kafka. Os vectores de caraterísticas destes vídeos são extraídos através de modelos de aprendizagem profunda, em que os dados não estruturados (vídeo) são convertidos em vectores de caraterísticas. Estes vectores de caraterísticas serão empacotados pelo sistema e enviados para o auditor de semelhanças.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Arquitetura do sistema de desduplicação de vídeo do Likee</span> </span></p>
<p>Os vectores de caraterísticas extraídos serão indexados pelo Milvus e armazenados no Ceph, antes de serem <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">carregados pelo nó de consulta do Milvus</a> para pesquisa posterior. Os IDs de vídeo correspondentes a estes vectores de caraterísticas também serão armazenados simultaneamente no TiDB ou no Pika, de acordo com as necessidades reais.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Utilizar a base de dados de vectores Milvus para potenciar a pesquisa por semelhança</h3><p>Ao procurar vectores semelhantes, os milhares de milhões de dados existentes, juntamente com grandes quantidades de novos dados gerados todos os dias, colocam grandes desafios à funcionalidade do motor de pesquisa de vectores. Após uma análise exaustiva, o Likee acabou por escolher o Milvus, um motor de pesquisa vetorial distribuído de elevado desempenho e elevada taxa de recuperação, para efetuar a pesquisa de semelhanças vectoriais.</p>
<p>Como se pode ver no diagrama abaixo, o procedimento de uma pesquisa por semelhança é o seguinte:</p>
<ol>
<li><p>Primeiro, o Milvus efectua uma pesquisa em lote para recuperar os 100 principais vectores semelhantes para cada um dos múltiplos vectores de caraterísticas extraídos de um novo vídeo. Cada vetor semelhante é associado ao seu ID de vídeo correspondente.</p></li>
<li><p>Em segundo lugar, ao comparar os IDs dos vídeos, o Milvus remove os vídeos duplicados e recupera os vectores de caraterísticas dos restantes vídeos a partir do TiDB ou do Pika.</p></li>
<li><p>Por fim, o Milvus calcula e pontua a semelhança entre cada conjunto de vectores de caraterísticas recuperados e os vectores de caraterísticas do vídeo consultado. O ID do vídeo com a pontuação mais elevada é devolvido como resultado. Assim, a pesquisa por semelhança de vídeo é concluída.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>Procedimento de uma pesquisa por semelhança</span> </span></p>
<p>Enquanto motor de pesquisa vetorial de elevado desempenho, o Milvus fez um trabalho extraordinário no sistema de desduplicação de vídeo do Likee, impulsionando grandemente o crescimento do negócio de vídeos curtos do BIGO. Em termos de negócios de vídeo, há muitos outros cenários em que o Milvus pode ser aplicado, como o bloqueio de conteúdo ilegal ou a recomendação personalizada de vídeos. Tanto a BIGO como a Milvus estão ansiosas por uma futura cooperação em mais áreas.</p>
