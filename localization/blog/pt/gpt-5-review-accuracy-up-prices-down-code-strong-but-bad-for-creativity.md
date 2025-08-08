---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: >-
  Análise do GPT-5: Precisão em alta, preços em baixa, código forte - mas mau
  para a criatividade
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  para os desenvolvedores, especialmente aqueles que criam agentes e pipelines
  RAG, esta versão pode ser a atualização mais útil até o momento.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>Após meses de especulação, a OpenAI finalmente lançou</strong> <a href="https://openai.com/gpt-5/"><strong>o GPT-5</strong></a><strong>.</strong> O modelo não é o relâmpago criativo que o GPT-4 foi, mas para os desenvolvedores, especialmente aqueles que constroem agentes e pipelines RAG, esta versão pode ser silenciosamente a atualização mais útil até agora.</p>
<p><strong>TL;DR para construtores:</strong> GPT-5 unifica arquiteturas, sobrecarrega I/O multimodal, reduz taxas de erros factuais, estende o contexto para 400k tokens e torna o uso em larga escala acessível. No entanto, a criatividade e o talento literário deram um notável passo atrás.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">O que há de novo sob o capô?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Núcleo unificado</strong> - funde a série digital GPT com os modelos de raciocínio da série O, proporcionando raciocínio de cadeia longa e multimodal numa única arquitetura.</p></li>
<li><p><strong>Multimodal de espetro total</strong> - Entrada/saída de texto, imagem, áudio e vídeo, tudo no mesmo modelo.</p></li>
<li><p><strong>Ganhos maciços de precisão</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44% menos erros factuais em comparação com o GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>78% menos erros factuais em relação ao o3.</p></li>
</ul></li>
<li><p><strong>Aumento das competências de domínio</strong> - Mais forte na geração de código, raciocínio matemático, consulta de saúde e escrita estruturada; as alucinações diminuíram significativamente.</p></li>
</ul>
<p>Juntamente com o GPT-5, a OpenAI também lançou <strong>três variantes adicionais</strong>, cada uma optimizada para diferentes necessidades:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Modelo</strong></th><th><strong>Descrição</strong></th><th><strong>Entrada / $ por 1M de tokens</strong></th><th><strong>Saída / $ por 1M de tokens</strong></th><th><strong>Atualização de conhecimentos</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Modelo principal, raciocínio de cadeia longa + multimodal completo</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Equivalente ao gpt-5, utilizado nas conversações ChatGPT</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% mais barato, mantém ~90% do desempenho de programação</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Borda/offline, contexto de 32K, latência &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>O GPT-5 bateu recordes em 25 categorias de benchmark - desde reparação de código a raciocínio multimodal e tarefas médicas - com melhorias consistentes de precisão.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Por que os desenvolvedores devem se preocupar - especialmente para RAG e agentes<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Os nossos testes práticos sugerem que esta versão é uma revolução silenciosa para Retrieval-Augmented Generation e fluxos de trabalho orientados por agentes.</p>
<ol>
<li><p><strong>Os cortes de preços</strong> tornam a experimentação viável - Custo de entrada da API: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1,25permilhão de</mn><mi>tokens</mi><mo separator="true">∗∗;</mo><mi>custo de</mi><mi>saída</mi><mo>:∗∗1</mo></mrow><annotation encoding="application/x-tex">,25 por milhão de tokens**; custo de saída: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1 <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span><span class="mpunct"> ∗;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>: <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>Uma janela de contexto de 400k</strong> (vs. 128k em o3/4o) permite-lhe manter o estado em fluxos de trabalho complexos de agentes de várias etapas sem corte de contexto.</p></li>
<li><p><strong>Menos alucinações e melhor uso da ferramenta</strong> - Suporta chamadas de ferramenta encadeadas em várias etapas, lida com tarefas complexas não padrão e melhora a confiabilidade da execução.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">Não sem falhas<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>Apesar de seus avanços técnicos, o GPT-5 ainda mostra limites claros.</p>
<p>No lançamento, o keynote da OpenAI apresentou um slide que calculava bizarramente <em>52,8 &gt; 69,1 = 30,8</em>, e nos nossos próprios testes, o modelo repetiu com confiança a explicação do "efeito Bernoulli" do livro didático, mas errado, para a elevação de um avião - lembrando-nos que <strong>ainda é um aprendiz de padrões, não um verdadeiro especialista no domínio.</strong></p>
<p><strong>Embora o desempenho STEM tenha melhorado, a profundidade criativa diminuiu.</strong> Muitos utilizadores de longa data notam um declínio no talento literário: a poesia parece mais plana, as conversas filosóficas têm menos nuances e as narrativas longas são mais mecânicas. A troca é clara - maior precisão factual e raciocínio mais forte em domínios técnicos, mas à custa do tom artístico e exploratório que outrora fez com que o GPT se sentisse quase humano.</p>
<p>Com isso em mente, vamos ver como o GPT-5 se comporta nos nossos testes práticos.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Testes de codificação<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Comecei com uma tarefa simples: escrever um script HTML que permite aos utilizadores carregar uma imagem e movê-la com o rato. O GPT-5 fez uma pausa de cerca de nove segundos e, em seguida, produziu um código funcional que lidava bem com a interação. Parecia um bom começo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A segunda tarefa era mais difícil: implementar a deteção de colisão entre polígonos e bolas dentro de um hexágono rotativo, com velocidade de rotação ajustável, elasticidade e contagem de bolas. O GPT-5 gerou a primeira versão em cerca de treze segundos. O código incluía todas as funcionalidades esperadas, mas tinha bugs e não funcionava.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Usei então a opção <strong>Corrigir erro</strong> do editor, e o GPT-5 corrigiu os erros para que o hexágono fosse renderizado. No entanto, as bolas nunca apareciam - a lógica de desova estava em falta ou incorrecta, o que significa que a função central do programa estava ausente apesar da configuração completa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Em resumo,</strong> o GPT-5 pode produzir código interativo limpo e bem estruturado e recuperar de erros simples de tempo de execução. Mas em cenários complexos, ainda corre o risco de omitir a lógica essencial, por isso a revisão humana e a iteração são necessárias antes da implantação.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Teste de raciocínio<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Coloquei um puzzle lógico de vários passos que envolvia cores de artigos, preços e pistas de posição - algo que levaria vários minutos a ser resolvido pela maioria dos humanos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Pergunta:</strong> <em>Qual é o item azul e qual é o seu preço?</em></p>
<p>O GPT-5 deu a resposta correta em apenas 9 segundos, com uma explicação clara e logicamente sólida. Este teste reforçou a força do modelo em raciocínio estruturado e dedução rápida.</p>
<h2 id="Writing-Test" class="common-anchor-header">Teste de escrita<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Recorro frequentemente ao ChatGPT para obter ajuda com blogues, publicações nas redes sociais e outros conteúdos escritos, pelo que a geração de texto é uma das capacidades que mais me interessa. Para este teste, pedi ao GPT-5 para criar uma publicação no LinkedIn com base num blogue sobre o analisador multilingue do Milvus 2.6.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O resultado foi bem organizado e atingiu todos os pontos-chave do blogue original, mas parecia demasiado formal e previsível - mais como um comunicado de imprensa corporativo do que algo destinado a despertar o interesse num feed social. Faltava-lhe o calor, o ritmo e a personalidade que fazem com que uma publicação se sinta humana e convidativa.</p>
<p>Pelo lado positivo, as ilustrações que o acompanhavam eram excelentes: claras, de acordo com a marca e perfeitamente alinhadas com o estilo técnico de Zilliz. Visualmente, foi perfeito; a escrita só precisa de um pouco mais de energia criativa para corresponder.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">Janela de contexto mais longa = morte do RAG e do VectorDB?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Abordámos este tema no ano passado, quando <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">a Google lançou o <strong>Gemini 1.5 Pro</strong></a> com a sua janela de contexto ultra-longa de 10 milhões de tokens. Na altura, algumas pessoas foram rápidas a prever o fim do RAG - e até mesmo o fim das bases de dados. Hoje em dia, o RAG não só está vivo como está a prosperar. Na prática, tornou-se <em>mais</em> capaz e produtivo, juntamente com bases de dados vectoriais como <a href="https://milvus.io/"><strong>Milvus</strong></a> e <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Agora, com o aumento do comprimento do contexto do GPT-5 e as capacidades mais avançadas de chamada de ferramentas, a questão voltou a colocar-se: <em>Ainda precisamos de bases de dados vectoriais para a ingestão de contexto, ou mesmo de agentes dedicados/canais RAG?</em></p>
<p><strong>A resposta curta: absolutamente sim. Continuamos a precisar delas.</strong></p>
<p>O contexto mais longo é útil, mas não substitui a recuperação estruturada. Os sistemas multiagentes continuam a ser uma tendência arquitetónica a longo prazo - e estes sistemas necessitam frequentemente de um contexto virtualmente ilimitado. Além disso, quando se trata de gerir dados privados e não estruturados de forma segura, uma base de dados vetorial será sempre o guardião final.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de assistir ao evento de lançamento da OpenAI e de fazer os meus próprios testes práticos, o GPT-5 parece menos um salto dramático e mais uma mistura refinada de pontos fortes do passado com algumas actualizações bem colocadas. Isso não é mau - é um sinal dos limites arquitectónicos e de qualidade de dados que os grandes modelos estão a começar a encontrar.</p>
<p>Como diz o ditado, <em>as críticas severas resultam de expectativas elevadas</em>. Qualquer desilusão em relação ao GPT-5 deve-se sobretudo à fasquia muito alta que a OpenAI estabeleceu para si própria. E, na verdade, uma melhor precisão, preços mais baixos e suporte multimodal integrado continuam a ser ganhos valiosos. Para os programadores que criam agentes e pipelines RAG, esta pode ser a atualização mais útil até agora.</p>
<p>Alguns amigos têm brincado sobre fazer "memoriais on-line" para o GPT-4o, alegando que a personalidade do antigo companheiro de bate-papo se foi para sempre. Eu não me importo com a mudança - o GPT-5 pode ser menos caloroso e tagarela, mas o seu estilo direto e sem rodeios é refrescantemente simples.</p>
<p><strong>E tu?</strong> Partilhe a sua opinião connosco - junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> ou participe na conversa no <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> e no <a href="https://x.com/milvusio">X</a>.</p>
