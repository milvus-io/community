---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Arquitetura geral
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: O bot de controlo de qualidade de última geração está aqui
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Construir um sistema de controlo de qualidade inteligente com PNL e Milvus</custom-h1><p>Projeto Milvus：github.com/milvus-io/milvus</p>
<p>O sistema de resposta a perguntas é comumente usado no campo do processamento de linguagem natural. É utilizado para responder a perguntas sob a forma de linguagem natural e tem uma vasta gama de aplicações. As aplicações típicas incluem: interação de voz inteligente, serviço de apoio ao cliente em linha, aquisição de conhecimentos, conversação emocional personalizada, entre outras. A maioria dos sistemas de resposta a perguntas pode ser classificada como: sistemas de resposta a perguntas generativas e de recuperação, sistemas de resposta a perguntas de uma ronda e de várias rondas, sistemas de resposta a perguntas abertas e sistemas de resposta a perguntas específicas.</p>
<p>Este artigo trata principalmente de um sistema de GQ concebido para um domínio específico, normalmente designado por robô inteligente de atendimento ao cliente. No passado, a construção de um robô de serviço ao cliente exigia normalmente a conversão do conhecimento do domínio numa série de regras e gráficos de conhecimento. O processo de construção depende fortemente da inteligência "humana". Com a aplicação da aprendizagem profunda no processamento de linguagem natural (PNL), a leitura automática pode encontrar automaticamente respostas a perguntas correspondentes diretamente a partir de documentos. O modelo de linguagem de aprendizagem profunda converte as perguntas e os documentos em vectores semânticos para encontrar a resposta correspondente.</p>
<p>Este artigo utiliza o modelo BERT de código aberto da Google e o Milvus, um motor de pesquisa vetorial de código aberto, para criar rapidamente um bot de perguntas e respostas baseado na compreensão semântica.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Arquitetura geral<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Este artigo implementa um sistema de resposta a perguntas através da correspondência de semelhanças semânticas. O processo geral de construção é o seguinte:</p>
<ol>
<li>Obter um grande número de perguntas com respostas num campo específico (um conjunto de perguntas padrão).</li>
<li>Utilizar o modelo BERT para converter estas perguntas em vectores de caraterísticas e armazená-las no Milvus. O Milvus atribui simultaneamente um ID de vetor a cada vetor de caraterísticas.</li>
<li>Armazene estes IDs de perguntas representativos e as suas respostas correspondentes no PostgreSQL.</li>
</ol>
<p>Quando um utilizador faz uma pergunta:</p>
<ol>
<li>O modelo BERT converte-a num vetor de caraterísticas.</li>
<li>O Milvus efectua uma pesquisa de similaridade e recupera o ID mais semelhante à pergunta.</li>
<li>O PostgreSQL devolve a resposta correspondente.</li>
</ol>
<p>O diagrama da arquitetura do sistema é o seguinte (as linhas azuis representam o processo de importação e as linhas amarelas representam o processo de consulta):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-system-architecture-milvus-bert-postgresql.png</span> </span></p>
<p>De seguida, mostramos-lhe como criar um sistema de perguntas e respostas online, passo a passo.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Etapas para criar o sistema de perguntas e respostas<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de começar, é necessário instalar o Milvus e o PostgreSQL. Para obter as etapas específicas de instalação, consulte o site oficial do Milvus.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Preparação dos dados</h3><p>Os dados experimentais deste artigo provêm de: https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>O conjunto de dados contém pares de dados de perguntas e respostas relacionados com o sector dos seguros. Neste artigo, extraímos 20.000 pares de perguntas e respostas. Através deste conjunto de dados de perguntas e respostas, é possível construir rapidamente um robot de serviço ao cliente para o sector dos seguros.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Gerar vectores de caraterísticas</h3><p>Este sistema utiliza um modelo pré-treinado pelo BERT. Descarregue-o a partir da ligação abaixo antes de iniciar um serviço: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>Utilize este modelo para converter a base de dados de perguntas em vectores de caraterísticas para uma futura pesquisa de semelhanças. Para mais informações sobre o serviço BERT, consulte https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-código-bloco.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Importar para Milvus e PostgreSQL</h3><p>Normalize e importe os vectores de caraterísticas gerados para o Milvus e, em seguida, importe os IDs devolvidos pelo Milvus e as respostas correspondentes para o PostgreSQL. O seguinte mostra a estrutura da tabela no PostgreSQL:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-importar-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-importar-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Recuperar respostas</h3><p>O utilizador introduz uma pergunta e, depois de gerar o vetor de caraterísticas através do BERT, pode encontrar a pergunta mais semelhante na biblioteca Milvus. Este artigo utiliza a distância cosseno para representar a semelhança entre duas frases. Como todos os vectores são normalizados, quanto mais próxima de 1 for a distância de cosseno dos dois vectores de caraterísticas, maior é a semelhança.</p>
<p>Na prática, o seu sistema pode não ter perguntas com correspondência perfeita na biblioteca. Então, pode definir um limite de 0,9. Se a maior distância de similaridade recuperada for menor do que este limite, o sistema avisará que não inclui perguntas relacionadas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-retrieve-answers.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">Demonstração do sistema<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>A seguir mostra-se um exemplo de interface do sistema:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application.png</span> </span></p>
<p>Introduza a sua pergunta na caixa de diálogo e receberá uma resposta correspondente:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de ler este artigo, esperamos que seja fácil construir o seu próprio sistema de Q&amp;A.</p>
<p>Com o modelo BERT, já não precisa de ordenar e organizar previamente os corpora de texto. Ao mesmo tempo, graças ao elevado desempenho e à elevada escalabilidade do motor de pesquisa vetorial de código aberto Milvus, o seu sistema de QA pode suportar um corpus de até centenas de milhões de textos.</p>
<p>O Milvus juntou-se oficialmente à Linux AI (LF AI) Foundation para incubação. É bem-vindo a juntar-se à comunidade Milvus e a trabalhar connosco para acelerar a aplicação das tecnologias de IA!</p>
<p>=&gt; Experimente a nossa demonstração em linha aqui: https://www.milvus.io/scenarios</p>
