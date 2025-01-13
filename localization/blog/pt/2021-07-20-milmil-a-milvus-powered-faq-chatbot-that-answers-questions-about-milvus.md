---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: >-
  MilMil Um chatbot de perguntas frequentes alimentado por Milvus que responde a
  perguntas sobre Milvus
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: >-
  Utilização de ferramentas de pesquisa vetorial de código aberto para criar um
  serviço de resposta a perguntas.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: Um chatbot de perguntas frequentes sobre Milvus que responde a perguntas sobre Milvus</custom-h1><p>A comunidade open-source criou recentemente o MilMil - um chatbot de FAQ do Milvus construído por e para utilizadores do Milvus. O MilMil está disponível 24 horas por dia, 7 dias por semana, em <a href="https://milvus.io/">Milvus.io</a>, para responder a perguntas comuns sobre o Milvus, a base de dados vetorial de código aberto mais avançada do mundo.</p>
<p>Este sistema de resposta a perguntas não só ajuda a resolver problemas comuns que os utilizadores do Milvus encontram mais rapidamente, como também identifica novos problemas com base nas submissões dos utilizadores. A base de dados do MilMil inclui perguntas que os utilizadores fizeram desde que o projeto foi lançado pela primeira vez sob uma licença de código aberto em 2019. As perguntas são armazenadas em duas coleções, uma para o Milvus 1.x e anterior e outra para o Milvus 2.0.</p>
<p>Atualmente, o MilMil só está disponível em inglês.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">Como é que o MilMil funciona?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>O MilMil <em>baseia-se</em> no modelo <em>sentence-transformers/paraphrase-mpnet-base-v2</em> para obter representações vectoriais da base de dados de FAQs, depois o Milvus é utilizado para a recuperação de semelhanças vectoriais para devolver perguntas semanticamente semelhantes.</p>
<p>Em primeiro lugar, os dados das FAQ são convertidos em vectores semânticos utilizando o BERT, um modelo de processamento de linguagem natural (PNL). Os vectores são depois inseridos no Milvus e a cada um deles é atribuída uma identificação única. Finalmente, as perguntas e respostas são inseridas no PostgreSQL, uma base de dados relacional, juntamente com os seus IDs vectoriais.</p>
<p>Quando os utilizadores enviam uma pergunta, o sistema converte-a num vetor de caraterísticas utilizando o BERT. Em seguida, procura no Milvus os cinco vectores mais semelhantes ao vetor de consulta e obtém os seus IDs. Finalmente, as perguntas e respostas que correspondem aos IDs dos vectores recuperados são devolvidas ao utilizador.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>processo-sistema.png</span> </span></p>
<p>Veja o projeto <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">do sistema de resposta a perguntas</a> no bootcamp do Milvus para explorar o código utilizado para criar chatbots de IA.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Pergunte ao MilMil sobre o Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Para conversar com o MilMil, navegue para qualquer página em <a href="https://milvus.io/">Milvus.io</a> e clique no ícone do pássaro no canto inferior direito. Digite sua pergunta na caixa de entrada de texto e clique em enviar. O MilMil responder-lhe-á em milissegundos! Para além disso, a lista pendente no canto superior esquerdo pode ser utilizada para alternar entre a documentação técnica de diferentes versões do Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>Depois de submeter uma pergunta, o bot devolve imediatamente três perguntas que são semanticamente semelhantes à pergunta de consulta. Pode clicar em "Ver resposta" para procurar potenciais respostas à sua pergunta ou clicar em "Ver mais" para ver mais perguntas relacionadas com a sua pesquisa. Se não estiver disponível uma resposta adequada, clique em "Introduza aqui os seus comentários" para colocar a sua pergunta juntamente com um endereço de correio eletrónico. A ajuda da comunidade Milvus chegará em breve!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>Experimente o MilMil e diga-nos o que pensa. Todas as perguntas, comentários ou qualquer forma de feedback são bem-vindos.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Não sejas um estranho<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Encontre ou contribua para o Milvus no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conecte-se conosco no <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
