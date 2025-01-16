---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: >-
  Ingerindo o caos: Os MLOps por detrás do tratamento de dados não estruturados
  de forma fiável à escala para RAG
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: >-
  Com tecnologias como VectorFlow e Milvus, a equipa pode testar eficazmente em
  diferentes ambientes, cumprindo simultaneamente os requisitos de privacidade e
  segurança.
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os dados estão a ser gerados mais rapidamente do que nunca, sob todas as formas imagináveis. Estes dados são a gasolina que irá alimentar uma nova vaga de aplicações de inteligência artificial, mas estes motores de melhoria da produtividade precisam de ajuda para ingerir este combustível. A vasta gama de cenários e casos extremos em torno dos dados não estruturados torna difícil a sua utilização em sistemas de IA de produção.</p>
<p>Para começar, há um grande número de fontes de dados. Estas exportam dados em vários formatos de ficheiro, cada um com as suas excentricidades. Por exemplo, a forma como se processa um PDF varia muito consoante a sua origem. A ingestão de um PDF para um caso de litígio de valores mobiliários centrar-se-á provavelmente em dados textuais. Em contrapartida, uma especificação de conceção de um sistema para um engenheiro de foguetões estará repleta de diagramas que exigem um processamento visual. A falta de um esquema definido em dados não estruturados aumenta ainda mais a complexidade. Mesmo quando o desafio do processamento dos dados é ultrapassado, a questão da sua ingestão à escala mantém-se. Os ficheiros podem variar significativamente de tamanho, o que altera a forma como são processados. É possível processar rapidamente um upload de 1 MB em uma API por HTTP, mas a leitura de dezenas de GBs de um único arquivo exige streaming e um trabalhador dedicado.</p>
<p>Ultrapassar estes desafios tradicionais da engenharia de dados é uma aposta para ligar dados em bruto a <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMs</a> através de <a href="https://zilliz.com/learn/what-is-vector-database">bases de dados vectoriais</a> como o <a href="https://github.com/milvus-io/milvus">Milvus</a>. No entanto, os casos de utilização emergentes, como a realização de pesquisas de semelhança semântica com a ajuda de uma base de dados vetorial, requerem novas etapas de processamento, como a fragmentação dos dados de origem, a orquestração de metadados para pesquisas híbridas, a escolha do modelo de incorporação vetorial adequado e a afinação dos parâmetros de pesquisa para determinar quais os dados a alimentar a LLM. Estes fluxos de trabalho são tão novos que não existem melhores práticas estabelecidas para os programadores seguirem. Em vez disso, têm de experimentar para encontrar a configuração correta e o caso de utilização para os seus dados. Para acelerar este processo, a utilização de um pipeline de incorporação de vectores para tratar a ingestão de dados na base de dados de vectores é inestimável.</p>
<p>Um pipeline de incorporação de vetores como o <a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a> conectará seus dados brutos ao banco de dados de vetores, incluindo fragmentação, orquestração de metadados, incorporação e upload. O VectorFlow permite que as equipas de engenharia se concentrem na lógica da aplicação principal, experimentando os diferentes parâmetros de recuperação gerados a partir do modelo de incorporação, a estratégia de fragmentação, os campos de metadados e os aspectos da pesquisa para ver o que tem melhor desempenho.</p>
<p>No nosso trabalho de ajudar as equipas de engenharia a passar os seus sistemas de <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">geração aumentada de recuperação (RAG)</a> do protótipo para a produção, observámos que a seguinte abordagem é bem sucedida no teste dos diferentes parâmetros de um pipeline de pesquisa RAG:</p>
<ol>
<li>Utilizar um pequeno conjunto de dados com os quais está familiarizado para acelerar a iteração, como alguns PDFs que tenham partes relevantes para as consultas de pesquisa.</li>
<li>Criar um conjunto padrão de perguntas e respostas sobre esse subconjunto de dados. Por exemplo, depois de ler os PDFs, escreva uma lista de perguntas e peça à sua equipa que chegue a acordo sobre as respostas.</li>
<li>Crie um sistema de avaliação automatizado que classifique o desempenho da recuperação em cada pergunta. Uma forma de o fazer é pegar na resposta do sistema RAG e voltar a passá-la pelo LLM com uma pergunta que indique se este resultado do RAG responde à pergunta dada a resposta correta. A resposta deve ser "sim" ou "não". Por exemplo, se tiver 25 perguntas nos seus documentos e o sistema acertar 20, pode utilizar este resultado para comparar com outras abordagens.</li>
<li>Certifique-se de que utiliza para a avaliação um LLM diferente do utilizado para codificar os vectores de incorporação armazenados na base de dados. O LLM de avaliação é tipicamente um descodificador de um modelo como o GPT-4. Um aspeto a ter em conta é o custo destas avaliações quando executadas repetidamente. Modelos de código aberto como o Llama2 70B ou o Deci AI LLM 6B, que podem ser executados numa única GPU mais pequena, têm aproximadamente o mesmo desempenho por uma fração do custo.</li>
<li>Execute cada teste várias vezes e calcule a média da pontuação para suavizar a estocasticidade do LLM.</li>
</ol>
<p>Mantendo todas as opções constantes, exceto uma, é possível determinar rapidamente quais parâmetros funcionam melhor para o seu caso de uso. Um pipeline de incorporação de vetor como o VectorFlow torna isso especialmente fácil no lado da ingestão, onde você pode experimentar rapidamente diferentes estratégias de fragmentação, comprimentos de fragmentação, sobreposições de fragmentação e modelos de incorporação de código aberto para ver o que leva aos melhores resultados. Isso é especialmente útil quando o conjunto de dados tem vários tipos de arquivos e fontes de dados que exigem lógica personalizada.</p>
<p>Quando a equipa sabe o que funciona para o seu caso de utilização, o pipeline de incorporação de vectores permite-lhe passar rapidamente para a produção sem ter de redesenhar o sistema para ter em conta aspectos como a fiabilidade e a monitorização. Com tecnologias como o VectorFlow e <a href="https://zilliz.com/what-is-milvus">o Milvus</a>, que são de código aberto e independentes da plataforma, a equipa pode testar eficazmente em diferentes ambientes, cumprindo simultaneamente os requisitos de privacidade e segurança.</p>
