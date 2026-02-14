---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Reflexão profunda: que modelo se adequa à
  sua pilha de agentes de IA?
author: 'Lumina Wang, Julie Xie'
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
  Comparação prática do GLM-5, MiniMax M2.5 e Gemini 3 Deep Think para
  codificação, raciocínio e agentes de IA. Inclui um tutorial RAG com Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>Em pouco mais de dois dias, três grandes modelos foram lançados em simultâneo: GLM-5, MiniMax M2.5 e Gemini 3 Deep Think. Todos os três apresentam as mesmas capacidades: <strong>codificação, raciocínio profundo e fluxos de trabalho agênticos.</strong> Todos os três afirmam ter resultados de última geração. Se olharmos para as folhas de especificações, quase poderíamos jogar um jogo de correspondência e eliminar pontos de discussão idênticos nos três.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O pensamento mais assustador? Provavelmente, o seu chefe já viu os anúncios e está ansioso por que crie nove aplicações internas utilizando os três modelos antes mesmo de a semana acabar.</p>
<p>Então, o que é que realmente distingue estes modelos? Como é que se deve escolher entre eles? E (como sempre) como é que os liga ao <a href="https://milvus.io/">Milvus</a> para criar uma base de dados de conhecimento interna? Marque esta página. Ela tem tudo o que você precisa.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5 e Gemini 3 Deep Think em resumo<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">O GLM-5 é líder em engenharia de sistemas complexos e tarefas de agentes de longo prazo</h3><p>Em 12 de fevereiro, a Zhipu lançou oficialmente o GLM-5, que se destaca em engenharia de sistemas complexos e fluxos de trabalho de agentes de longa duração.</p>
<p>O modelo tem 355B-744B parâmetros (40B activos), treinados em 28,5T tokens. Integra mecanismos de atenção esparsa com uma estrutura de aprendizagem por reforço assíncrona denominada Slime, o que lhe permite lidar com contextos ultra-longos sem perda de qualidade, mantendo os custos de implementação baixos.</p>
<p>O GLM-5 liderou o pacote de código aberto nos principais benchmarks, ficando em primeiro lugar no SWE-bench Verified (77,8) e em primeiro lugar no Terminal Bench 2.0 (56,2) - à frente do MiniMax 2.5 e do Gemini 3 Deep Think. Dito isto, as suas pontuações principais ainda ficam atrás dos principais modelos de código fechado, como o Claude Opus 4.5 e o GPT-5.2. No Vending Bench 2, uma avaliação de simulação de negócios, o GLM-5 gerou US$ 4.432 em lucro anual simulado, colocando-o aproximadamente na mesma faixa dos sistemas de código fechado.</p>
<p>O GLM-5 também fez actualizações significativas às suas capacidades de engenharia de sistemas e de agentes de longo prazo. Agora pode converter texto ou matérias-primas diretamente em ficheiros .docx, .pdf e .xlsx, e gerar resultados específicos como documentos de requisitos de produtos, planos de aulas, exames, folhas de cálculo, relatórios financeiros, fluxogramas e menus.</p>
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
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">O Gemini 3 Deep Think estabelece uma nova fasquia para o raciocínio científico</h3><p>Nas primeiras horas de 13 de fevereiro de 2026, a Google lançou oficialmente o Gemini 3 Deep Think, uma atualização importante a que chamarei (provisoriamente) o modelo de investigação e raciocínio mais forte do planeta. Afinal de contas, o Gemini foi o único modelo que passou no teste da lavagem de carros: "<em>Quero lavar o meu carro e o lava-rápido fica apenas a 50 metros de distância. Devo ligar o meu carro e conduzir até lá ou ir a pé</em>?"</p>
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
<p>O seu ponto forte é o raciocínio de alto nível e o desempenho em competição: atingiu 3455 Elo no Codeforces, o que equivale ao oitavo melhor programador competitivo do mundo. Atingiu o padrão de medalha de ouro nas partes escritas das Olimpíadas Internacionais de Física, Química e Matemática de 2025. A eficiência de custos é outro avanço. O ARC-AGI-1 custa apenas 7,17 dólares por tarefa, uma redução de 280 a 420 vezes em comparação com o o3-preview da OpenAI de 14 meses antes. Do lado da aplicação, os maiores ganhos do Deep Think estão na investigação científica. Os especialistas já o estão a utilizar para a revisão por pares de artigos profissionais de matemática e para otimizar fluxos de trabalho complexos de preparação de crescimento de cristais.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 compete em termos de custo e velocidade para cargas de trabalho de produção</h3><p>No mesmo dia, o MiniMax lançou o M2.5, posicionando-o como o campeão em termos de custo e eficiência para casos de uso de produção.</p>
<p>Como uma das famílias de modelos de iteração mais rápida da indústria, o M2.5 estabelece novos resultados SOTA em codificação, chamada de ferramentas, pesquisa e produtividade de escritório. O custo é o seu maior argumento de venda: a versão rápida funciona a cerca de 100 TPS, com entrada a <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,30 milhões de tokens e saída a</mn><mi>0</mi></mrow><annotation encoding="application/x-tex">,30 por milhão de tokens e saída a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,30 milhões de tokens e saída a</span><span class="mord mathnormal">2</span></span></span></span>,40 por milhão de tokens. A versão de 50 TPS reduz o custo de produção em mais metade. A velocidade melhorou 37% em relação ao M2.1 anterior, e completa as tarefas verificadas no SWE-bench numa média de 22,8 minutos, o que corresponde aproximadamente ao Claude Opus 4.6. No que respeita às capacidades, o M2.5 suporta o desenvolvimento full-stack em mais de 10 linguagens, incluindo Go, Rust e Kotlin, abrangendo tudo, desde a conceção de sistemas zero a um até à revisão completa do código. Para fluxos de trabalho de escritório, a sua funcionalidade Office Skills integra-se profundamente com o Word, PPT e Excel. Quando combinada com conhecimentos de domínio em finanças e direito, pode gerar relatórios de investigação e modelos financeiros prontos para utilização direta.</p>
<p>Esta é a visão geral de alto nível. De seguida, vamos analisar o seu desempenho em testes práticos.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Comparações práticas<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">Renderização de cenas 3D: O Gemini 3 Deep Think produz os resultados mais realistas</h3><p>Pegámos num pedido que os utilizadores já tinham testado no Gemini 3 Deep Think e executámo-lo no GLM-5 e no MiniMax M2.5 para uma comparação direta. O pedido: construir uma cena Three.js completa num único ficheiro HTML que renderiza uma sala interior totalmente 3D indistinguível de uma pintura a óleo clássica num museu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 Pensamento profundo</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>O Gemini 3 Deep Think</strong> apresentou o resultado mais forte. Interpretou com precisão o pedido e gerou uma cena 3D de alta qualidade. A iluminação foi o destaque: a direção e a queda das sombras pareceram naturais, transmitindo claramente a relação espacial da luz natural que entra por uma janela. Os pormenores finos também foram impressionantes, incluindo a textura meio derretida das velas e a qualidade do material dos selos de cera vermelha. A fidelidade visual geral foi elevada.</p>
<p><strong>O GLM-5</strong> produziu um trabalho detalhado de modelação de objectos e texturas, mas o seu sistema de iluminação tinha problemas visíveis. As sombras da mesa eram apresentadas como blocos duros, puramente pretos, sem transições suaves. O selo de cera parecia flutuar acima da superfície da mesa, não conseguindo lidar corretamente com a relação de contacto entre os objectos e o tampo da mesa. Estes artefactos apontam para a necessidade de melhorar a iluminação global e o raciocínio espacial.</p>
<p><strong>O MiniMax M2.5</strong> não conseguiu analisar a descrição complexa da cena de forma eficaz. O resultado foi apenas o movimento desordenado de partículas, o que indica limitações significativas tanto na compreensão como na geração ao lidar com instruções semânticas de várias camadas com requisitos visuais precisos.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">Geração de SVG: os três modelos tratam-no de forma diferente</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Proposta:</strong> Gerar um SVG de um pelicano castanho da Califórnia a andar de bicicleta. A bicicleta deve ter raios e um quadro com a forma correta. O pelicano deve ter a sua bolsa grande caraterística e deve haver uma indicação clara de penas. O pelicano deve estar claramente a pedalar a bicicleta. A imagem deve mostrar a plumagem completa de reprodução do pelicano castanho da Califórnia.</p>
<p><strong>Gémeos 3 Pensamento profundo</strong></p>
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
<p><strong>O Gemini 3 Deep Think</strong> produziu o SVG mais completo de todos. A postura de condução do pelicano é precisa: o seu centro de gravidade assenta naturalmente no assento e os pés apoiam-se nos pedais, numa pose dinâmica de ciclismo. A textura das penas é detalhada e em camadas. O único ponto fraco é o facto de a bolsa de garganta caraterística do pelicano ter sido desenhada demasiado grande, o que altera ligeiramente as proporções gerais.</p>
<p><strong>O GLM-5</strong> tinha problemas visíveis de postura. Os pés estão corretamente colocados nos pedais, mas a posição geral de sentado afasta-se de uma postura natural de condução e a relação entre o corpo e o assento não parece correta. Dito isto, o seu trabalho de pormenor é sólido: a bolsa da garganta está bem proporcionada e a qualidade da textura das penas é respeitável.</p>
<p><strong>A MiniMax M2.5</strong> optou por um estilo minimalista e ignorou completamente os elementos de fundo. A posição do pelicano na bicicleta está mais ou menos correta, mas o trabalho de pormenor é insuficiente. O guiador tem a forma errada, a textura das penas é quase inexistente, o pescoço é demasiado grosso e existem artefactos ovais brancos na imagem que não deveriam estar lá.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">Como escolher entre GLM-5, MiniMax M2.5 e Gemin 3 Deep Think<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Em todos os nossos testes, o MiniMax M2.5 foi o mais lento a gerar resultados, exigindo mais tempo para pensar e raciocinar. O GLM-5 teve um desempenho consistente e esteve mais ou menos a par do Gemini 3 Deep Think em termos de velocidade.</p>
<p>Aqui está um guia de seleção rápido que elaborámos:</p>
<table>
<thead>
<tr><th>Caso de uso principal</th><th>Modelo recomendado</th><th>Principais pontos fortes</th></tr>
</thead>
<tbody>
<tr><td>Pesquisa científica, raciocínio avançado (física, química, matemática, design de algoritmos complexos)</td><td>Pensamento profundo Gemini 3</td><td>Desempenho com medalha de ouro em competições académicas. Verificação de dados científicos de alto nível. Programação competitiva de nível mundial no Codeforces. Aplicações de investigação comprovadas, incluindo a identificação de falhas lógicas em artigos profissionais. (Atualmente limitado a subscritores do Google AI Ultra e a utilizadores empresariais selecionados; o custo por tarefa é relativamente elevado).</td></tr>
<tr><td>Implementação de código aberto, personalização de intranet empresarial, desenvolvimento full-stack, integração de competências de escritório</td><td>Zhipu GLM-5</td><td>Modelo de código aberto de topo de gama. Fortes capacidades de engenharia ao nível do sistema. Suporta a implementação local com custos geríveis.</td></tr>
<tr><td>Cargas de trabalho sensíveis ao custo, programação em vários idiomas, desenvolvimento multiplataforma (Web/Android/iOS/Windows), compatibilidade com o escritório</td><td>MiniMax M2.5</td><td>A 100 TPS: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>30</mi><mn>milhões de tokens</mn></mrow></semantics></math></span></span>de entrada <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">, 0,30 por milhão de tokens de entrada,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">30</span><span class="mord">milhões de tokens de entrada</span><span class="mpunct">,</span></span></span></span>2,40 por milhão de tokens de saída. SOTA em benchmarks de escritório, codificação e chamadas de ferramentas. Classificado em primeiro lugar no Multi-SWE-Bench. Forte generalização. As taxas de aprovação no Droid/OpenCode excedem o Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">Tutorial RAG: Ligar o GLM-5 ao Milvus para uma Base de Conhecimento<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Tanto o GLM-5 como o MiniMax M2.5 estão disponíveis através do <a href="https://openrouter.ai/">OpenRouter</a>. Registe-se e crie um <code translate="no">OPENROUTER_API_KEY</code> para começar.</p>
<p>Este tutorial usa o GLM-5 da Zhipu como exemplo de LLM. Para usar o MiniMax, basta trocar o nome do modelo para <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Dependências e configuração do ambiente</h3><p>Instale ou actualize o pymilvus, openai, requests e tqdm para as suas versões mais recentes:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>Este tutorial usa o GLM-5 como LLM e o text-embedding-3-small do OpenAI como modelo de incorporação.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Preparação dos dados</h3><p>Vamos usar as páginas de FAQ da documentação do Milvus 2.4.x como a nossa base de conhecimento privada.</p>
<p>Descarregue o ficheiro zip e extraia os documentos para uma pasta <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Carregue todos os ficheiros Markdown de <code translate="no">milvus_docs/en/faq</code>. Dividimos cada ficheiro em <code translate="no">&quot;# &quot;</code> para separar o conteúdo por secções principais:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM e configuração do modelo de incorporação</h3><p>Vamos usar o GLM-5 como LLM e o text-embedding-3-small como modelo de incorporação:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Gere um embedding de teste e imprima suas dimensões e seus primeiros elementos:</p>
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
<p>Output:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Carregar dados no Milvus</h3><p><strong>Criar uma coleção:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Uma nota sobre a configuração do MilvusClient:</p>
<ul>
<li><p>Definir o URI para um ficheiro local (e.g., <code translate="no">./milvus.db</code>) é a opção mais simples. Ele usa automaticamente o Milvus Lite para armazenar todos os dados nesse arquivo.</p></li>
<li><p>Para dados em grande escala, você pode implantar um servidor Milvus de maior desempenho no Docker ou Kubernetes. Nesse caso, utilize o URI do servidor (por exemplo, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>Para utilizar o Zilliz Cloud (a versão em nuvem totalmente gerida do Milvus), defina o URI e o token para o Ponto de extremidade público e a chave da API a partir da consola do Zilliz Cloud.</p></li>
</ul>
<p>Verifique se a coleção já existe e elimine-a em caso afirmativo:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Criar uma nova coleção com os parâmetros especificados. Se não fornecer definições de campo, o Milvus cria automaticamente um campo <code translate="no">id</code> por defeito como chave primária e um campo <code translate="no">vector</code> para dados vectoriais. Um campo JSON reservado armazena todos os campos e valores não definidos no esquema:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Inserir dados</h3><p>Iterar através das linhas de texto, gerar embeddings e inserir os dados no Milvus. O campo <code translate="no">text</code> não está definido no esquema. Ele é adicionado automaticamente como um campo dinâmico apoiado pelo campo JSON reservado do Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Construir o pipeline RAG</h3><p><strong>Recuperar documentos relevantes:</strong></p>
<p>Vamos fazer uma pergunta comum sobre o Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pesquisar a coleção para obter os 3 resultados mais relevantes:</p>
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
<p>Os resultados são ordenados por distância, o mais próximo primeiro:</p>
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
<p><strong>Gerar uma resposta com o LLM:</strong></p>
<p>Combinar os documentos recuperados numa cadeia de contexto:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Configurar o sistema e os avisos ao utilizador. A mensagem do utilizador é criada a partir dos documentos obtidos do Milvus:</p>
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
<p>Chamar o GLM-5 para gerar a resposta final:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>O GLM-5 devolve uma resposta bem estruturada:</p>
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
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Conclusão: Escolha o modelo, depois construa o pipeline<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Todos os três modelos são fortes, mas são fortes em coisas diferentes. O Gemini 3 Deep Think é a escolha certa quando a profundidade do raciocínio é mais importante que o custo. O GLM-5 é a melhor opção de código aberto para equipas que necessitam de implementação local e engenharia ao nível do sistema. O MiniMax M2.5 faz sentido quando se está a otimizar o rendimento e o orçamento em cargas de trabalho de produção.</p>
<p>O modelo escolhido é apenas metade da equação. Para transformar qualquer um destes modelos numa aplicação útil, é necessária uma camada de recuperação que possa ser dimensionada com os seus dados. É aí que Milvus se encaixa. O tutorial RAG acima funciona com qualquer modelo compatível com OpenAI, pelo que a troca entre GLM-5, MiniMax M2.5 ou qualquer versão futura requer uma única alteração de linha.</p>
<p>Se você estiver projetando agentes de IA locais ou locais e quiser discutir a arquitetura de armazenamento, o design da sessão ou a reversão segura com mais detalhes, sinta-se à vontade para entrar em nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal do Slack</a>.</p>
<p>Se você quiser se aprofundar na criação de agentes de IA, aqui estão mais recursos para ajudar você a começar.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Como criar sistemas multiagentes prontos para produção com Agno e Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">Escolhendo o modelo de incorporação correto para seu pipeline RAG</a></p></li>
<li><p><a href="https://zilliz.com/learn">Como criar um agente de IA com o Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">O que é o OpenClaw? Guia completo para o agente de IA de código aberto</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial do OpenClaw: Conecte-se ao Slack para obter um assistente de IA local</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Construir agentes de IA do tipo Clawdbot com LangGraph e Milvus</a></p></li>
</ul>
