---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Qual modelo deve ser usado?'
author: Lumina Wang
date: 2026-4-28
cover: >-
  assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_1_98e0113041.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Compare o DeepSeek V4, GPT-5.5 e Qwen3.6 em testes de recuperação, depuração e
  de contexto longo e, em seguida, crie um pipeline Milvus RAG com o DeepSeek
  V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>As novas versões de modelos estão a avançar mais rapidamente do que as equipas de produção conseguem avaliá-las. DeepSeek V4, GPT-5.5 e Qwen3.6-35B-A3B parecem fortes no papel, mas a questão mais difícil para os desenvolvedores de aplicativos de IA é prática: qual modelo você deve usar para sistemas de recuperação pesada, tarefas de codificação, análise de contexto longo e <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a>?</p>
<p><strong>Este artigo compara os três modelos em testes práticos:</strong> recuperação de informações em tempo real, depuração de concurrency-bug e recuperação de marcadores de contexto longo. Em seguida, mostra como conectar o DeepSeek V4 ao <a href="https://zilliz.com/learn/what-is-vector-database">banco de dados de vetores Milvus</a>, para que o contexto recuperado venha de uma base de conhecimento pesquisável em vez de apenas os parâmetros do modelo.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">O que são DeepSeek V4, GPT-5.5 e Qwen3.6-35B-A3B?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5 e Qwen3.6-35B-A3B são modelos de IA diferentes que visam diferentes partes da pilha de modelos.</strong> O DeepSeek V4 concentra-se na inferência de contexto longo de peso aberto. O GPT-5.5 concentra-se no desempenho hospedado na fronteira, codificação, pesquisa on-line e tarefas pesadas de ferramentas. O Qwen3.6-35B-A3B foca-se na implementação multimodal de peso aberto com uma pegada de parâmetros activos muito mais pequena.</p>
<p>A comparação é importante porque um sistema <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">de pesquisa vetorial de produção</a> raramente depende apenas do modelo. A capacidade do modelo, o comprimento do contexto, o controlo da implementação, a qualidade da recuperação e o custo de serviço afectam a experiência final do utilizador.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: Um modelo MoE de peso aberto para controle de custo de contexto longo</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>é uma família de modelos MoE de peso aberto lançada pela DeepSeek em 24 de abril de 2026.</strong> O lançamento oficial lista duas variantes: DeepSeek V4-Pro e DeepSeek V4-Flash. O V4-Pro tem 1,6T de parâmetros totais com 49B ativados por token, enquanto o V4-Flash tem 284B de parâmetros totais com 13B ativados por token. Ambos suportam uma janela de contexto de 1M-token.</p>
<p>O <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">cartão do modelo DeepSeek V4-Pro</a> também lista o modelo como licenciado pelo MIT e disponível através do Hugging Face e do ModelScope. Para as equipas que criam fluxos de trabalho de documentos de contexto longo, o principal apelo é o controlo de custos e a flexibilidade de implementação em comparação com APIs de fronteira totalmente fechadas.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: Um modelo de fronteira hospedado para codificação, pesquisa e uso de ferramentas</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>O GPT-5.5</strong></a> <strong>é um modelo de fronteira fechado lançado pela OpenAI a 23 de abril de 2026.</strong> A OpenAI posiciona-o para codificação, pesquisa online, análise de dados, trabalho com documentos, trabalho com folhas de cálculo, operação de software e tarefas baseadas em ferramentas. Os documentos oficiais do modelo listam <code translate="no">gpt-5.5</code> com uma janela de contexto de API de 1M-token, enquanto os limites dos produtos Codex e ChatGPT podem ser diferentes.</p>
<p>O OpenAI apresenta bons resultados de benchmark de codificação: 82,7% no Terminal-Bench 2.0, 73,1% no Expert-SWE e 58,6% no SWE-Bench Pro. A contrapartida é o preço: o preço oficial da API lista o GPT-5.5 a <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>5</mi></mrow><annotation encoding="application/x-tex">por 1Minputtokens</annotation><mrow><mn>e 5</mn></mrow> por 1</semantics></math></span></span>M <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">input tokens e</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">5</span></span></span></span>por 1Minputtokens e 30 por 1M output tokens, antes de qualquer detalhe de preço específico do produto ou de contexto longo.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: Um modelo de parâmetro ativo mais pequeno para cargas de trabalho locais e multimodais</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>O Qwen3.6-35B-A3B</strong></a> <strong>é um modelo MoE de peso aberto da equipa Qwen da Alibaba.</strong> O seu cartão de modelo lista 35B parâmetros totais, 3B parâmetros activados, um codificador de visão e licenciamento Apache-2.0. Ele suporta uma janela de contexto nativa de 262.144 tokens e pode ser estendido para cerca de 1.010.000 tokens com o escalonamento YaRN.</p>
<p>Isso torna o Qwen3.6-35B-A3B atraente quando a implantação local, o serviço privado, a entrada de texto de imagem ou as cargas de trabalho em idioma chinês são mais importantes do que a conveniência do modelo de fronteira gerenciado.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Especificações do modelo comparadas</h3><table>
<thead>
<tr><th>Modelo de implantação</th><th>Modelo de implantação</th><th>Informações de parâmetros públicos</th><th>Janela de contexto</th><th>Ajuste mais forte</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>MoE de peso aberto; API disponível</td><td>1.6T total / 49B ativo</td><td>1M tokens</td><td>Implantações de engenharia de contexto longo e sensíveis ao custo</td></tr>
<tr><td>GPT-5.5</td><td>Modelo fechado alojado</td><td>Não divulgado</td><td>1 milhão de tokens na API</td><td>Codificação, investigação em tempo real, utilização de ferramentas e capacidade global mais elevada</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>MoE multimodal de peso aberto</td><td>35B total / 3B ativo</td><td>262K nativo; ~1M com YaRN</td><td>Implantação local/privada, entrada multimodal e cenários em chinês</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">Como testamos o DeepSeek V4, GPT-5.5 e Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>Esses testes não são um substituto para conjuntos completos de benchmark. São verificações práticas que refletem questões comuns dos desenvolvedores: o modelo pode recuperar informações atuais, raciocinar sobre bugs sutis de código e localizar fatos dentro de um documento muito longo?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">Qual modelo lida melhor com a recuperação de informações em tempo real?</h3><p>Fizemos a cada modelo três perguntas sensíveis ao tempo usando a pesquisa na Web, quando disponível. A instrução era simples: devolver apenas a resposta e incluir o URL de origem.</p>
<table>
<thead>
<tr><th>Pergunta</th><th>Resposta esperada no momento do teste</th><th>Fonte</th></tr>
</thead>
<tbody>
<tr><td>Quanto custa gerar uma imagem de qualidade média de 1024×1024 com <code translate="no">gpt-image-2</code> através da API OpenAI?</td><td><code translate="no">$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">Preço da geração de imagens OpenAI</a></td></tr>
<tr><td>Qual é a canção n.º 1 da Billboard Hot 100 desta semana e quem é o artista?</td><td><code translate="no">Choosin' Texas</code> por Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Gráfico da Billboard Hot 100</a></td></tr>
<tr><td>Quem lidera atualmente a classificação dos pilotos de F1 de 2026?</td><td>Kimi Antonelli</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Classificação dos pilotos de Fórmula 1</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Nota: Estas perguntas são sensíveis ao tempo. As respostas esperadas reflectem os resultados no momento em que realizámos o teste.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>A página de preços de imagens da OpenAI usa o rótulo "médio" em vez de "padrão" para o resultado de $0,053 1024×1024, portanto a pergunta é normalizada aqui para corresponder ao texto atual da API.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Resultados da recuperação em tempo real: GPT-5.5 teve a vantagem mais clara</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O DeepSeek V4-Pro respondeu à primeira pergunta incorretamente. Ele não conseguiu responder à segunda e à terceira perguntas por meio da pesquisa na Web ao vivo nessa configuração.</p>
<p>A segunda resposta incluiu o URL correto da Billboard, mas não recuperou a música nº 1 atual. A terceira resposta utilizou a fonte errada, pelo que a considerámos incorrecta.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O GPT-5.5 lidou muito melhor com este teste. As suas respostas foram curtas, exactas, com fontes e rápidas. Quando uma tarefa depende de informação atual e o modelo tem disponível a recuperação em tempo real, o GPT-5.5 teve uma clara vantagem nesta configuração.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Qwen3.6-35B-A3B produziu um resultado semelhante ao DeepSeek V4-Pro. Ele não tinha acesso à Web ao vivo nesta configuração, portanto, não pôde concluir a tarefa de recuperação em tempo real.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">Qual modelo é melhor para depurar bugs de simultaneidade?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>O segundo teste usou um exemplo de transferência bancária em Python com três camadas de problemas de concorrência. A tarefa não era apenas encontrar a condição de corrida óbvia, mas também explicar por que o saldo total quebra e fornecer o código corrigido.</p>
<table>
<thead>
<tr><th>Camada</th><th>Problema</th><th>O que corre mal</th></tr>
</thead>
<tbody>
<tr><td>Básico</td><td>Condição de corrida</td><td><code translate="no">if self.balance &gt;= amount</code> e <code translate="no">self.balance -= amount</code> não são atómicas. Duas threads podem passar a verificação de saldo ao mesmo tempo e depois ambas subtraem dinheiro.</td></tr>
<tr><td>Médio</td><td>Risco de bloqueio</td><td>Um bloqueio ingénuo por conta pode provocar um impasse quando a transferência A→B bloqueia A primeiro e a transferência B→A bloqueia B primeiro. Este é o clássico deadlock ABBA.</td></tr>
<tr><td>Avançado</td><td>Âmbito de bloqueio incorreto</td><td>Proteger apenas <code translate="no">self.balance</code> não protege <code translate="no">target.balance</code>. Uma correção correta deve bloquear ambas as contas numa ordem estável, normalmente por ID de conta, ou utilizar um bloqueio global com menor concorrência.</td></tr>
</tbody>
</table>
<p>O prompt e o código são os mostrados abaixo:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Resultados da depuração de código: GPT-5.5 deu a resposta mais completa</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>O DeepSeek V4-Pro forneceu uma análise concisa e foi direto para a solução de bloqueio ordenado, que é a maneira padrão de evitar o deadlock ABBA. Sua resposta demonstrou a correção correta, mas não gastou muito tempo explicando por que a correção ingênua baseada em bloqueio poderia introduzir um novo modo de falha.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O GPT-5.5 teve o melhor desempenho neste teste. Ele encontrou os principais problemas, antecipou o risco de deadlock, explicou por que o código original poderia falhar e forneceu uma implementação completa corrigida.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Qwen3.6-35B-A3B identificou os erros com exatidão e a sua sequência de execução de exemplo era clara. A parte mais fraca foi a correção: escolheu um bloqueio global ao nível da classe, o que faz com que todas as contas partilhem o mesmo bloqueio. Isso funciona para uma pequena simulação, mas é uma má escolha para um sistema bancário real porque transferências de contas não relacionadas ainda devem esperar no mesmo bloqueio.</p>
<p>Resumindo<strong>:</strong> GPT-5.5 não só resolveu o bug atual, mas também avisou sobre o próximo bug que um desenvolvedor poderia introduzir. DeepSeek V4-Pro deu a correção mais limpa não-GPT. O Qwen3.6 encontrou os problemas e produziu um código funcional, mas não chamou a atenção para o comprometimento da escalabilidade.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">Qual modelo lida melhor com a recuperação de contexto longo?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>Para o teste de contexto longo, usamos o texto completo do <em>Sonho da Câmara Vermelha</em>, com cerca de 850.000 caracteres chineses. Inserimos um marcador oculto na posição de 500.000 caracteres:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>Depois carregámos o ficheiro para cada modelo e pedimos-lhe que encontrasse o conteúdo do marcador e a sua posição.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Resultados da recuperação de contexto longo: GPT-5.5 encontrou o marcador com mais precisão</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O DeepSeek V4-Pro encontrou o marcador oculto, mas não encontrou a posição correta do caractere. Também deu o contexto circundante errado. Neste teste, pareceu localizar semanticamente o marcador, mas perdeu a noção da posição exacta enquanto raciocinava sobre o documento.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O GPT-5.5 encontrou o conteúdo do marcador, a posição e o contexto circundante corretamente. Reportou a posição como 500,002 e até distinguiu entre contagem indexada a zero e contagem indexada a um. O contexto circundante também correspondia ao texto utilizado aquando da inserção do marcador.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Qwen3.6-35B-A3B encontrou o conteúdo do marcador e o contexto próximo corretamente, mas a sua estimativa de posição estava errada.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">O que é que estes testes dizem sobre a seleção de modelos?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Os três testes apontam para um padrão de seleção prático: <strong>O GPT-5.5 é a escolha de capacidade, o DeepSeek V4-Pro é a escolha de desempenho de custo de contexto longo e o Qwen3.6-35B-A3B é a escolha de controlo local.</strong></p>
<table>
<thead>
<tr><th>Modelo</th><th>Melhor ajuste</th><th>O que aconteceu nos nossos testes</th><th>Principal advertência</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Melhor capacidade geral</td><td>Venceu os testes de recuperação em tempo real, depuração de concorrência e marcador de contexto longo</td><td>Custo mais alto; mais forte quando a precisão e o uso da ferramenta justificam o prémio</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Implantação de contexto longo e de baixo custo</td><td>Deu a correção não-GPT mais forte para o bug de simultaneidade e encontrou o conteúdo do marcador</td><td>Necessita de ferramentas de recuperação externas para tarefas na Web em tempo real; o rastreio exato da localização de caracteres foi mais fraco neste teste</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Implementação local, pesos abertos, entrada multimodal, cargas de trabalho em língua chinesa</td><td>Bom desempenho na identificação de erros e na compreensão de contextos longos</td><td>A qualidade da correção foi menos escalável; o acesso à Web em direto não estava disponível nesta configuração</td></tr>
</tbody>
</table>
<p>Use o GPT-5.5 quando precisar do resultado mais forte, e o custo for secundário. Use o DeepSeek V4-Pro quando precisar de contexto longo, menor custo de serviço e implantação amigável de API. Utilize o Qwen3.6-35B-A3B quando os pesos abertos, a implementação privada, o suporte multimodal ou o controlo da pilha de serviços forem mais importantes.</p>
<p>Para aplicações de recuperação pesada, no entanto, a escolha do modelo é apenas metade da história. Mesmo um modelo forte de contexto longo tem melhor desempenho quando o contexto é recuperado, filtrado e fundamentado por um <a href="https://zilliz.com/learn/generative-ai">sistema de pesquisa semântica</a> dedicado.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Porque é que o RAG ainda é importante para os modelos de contexto longo<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma janela de contexto longo não elimina a necessidade de recuperação. Altera a estratégia de recuperação.</p>
<p>Numa aplicação RAG, o modelo não deve analisar todos os documentos em todos os pedidos. Uma <a href="https://zilliz.com/learn/introduction-to-unstructured-data">arquitetura de base de dados vetorial</a> armazena embeddings, procura pedaços semanticamente relevantes, aplica filtros de metadados e devolve um conjunto de contexto compacto ao modelo. Isto dá ao modelo uma melhor entrada, reduzindo o custo e a latência.</p>
<p>O Milvus enquadra-se nesta função porque lida com <a href="https://milvus.io/docs/schema.md">esquemas de coleção</a>, indexação de vectores, metadados escalares e operações de recuperação num único sistema. Você pode começar localmente com o <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, passar para um <a href="https://milvus.io/docs/quickstart.md">quickstart</a> autônomo <a href="https://milvus.io/docs/quickstart.md">do Milvus</a>, implantar com a <a href="https://milvus.io/docs/install_standalone-docker.md">instalação do Docker</a> ou <a href="https://milvus.io/docs/install_standalone-docker-compose.md">a implantação do Docker Compose</a> e escalar ainda mais com a <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">implantação do Kubernetes</a> quando a carga de trabalho crescer.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Como criar um pipeline RAG com Milvus e DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>O passo a passo a seguir cria um pequeno pipeline RAG usando DeepSeek V4-Pro para geração e Milvus para recuperação. A mesma estrutura se aplica a outros LLMs: crie embeddings, armazene-os em uma coleção, pesquise o contexto relevante e passe esse contexto para o modelo.</p>
<p>Para um passo-a-passo mais alargado, consulte o <a href="https://milvus.io/docs/build-rag-with-milvus.md">tutorial</a> oficial <a href="https://milvus.io/docs/build-rag-with-milvus.md">do Milvus RAG</a>. Este exemplo mantém o pipeline pequeno para que o fluxo de recuperação seja fácil de inspecionar.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Preparar o ambiente<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Instalar as dependências</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Se estiver a utilizar o Google Colab, poderá ter de reiniciar o tempo de execução depois de instalar as dependências. Clique no menu <strong>Tempo de execução</strong> e selecione <strong>Reiniciar sessão</strong>.</p>
<p>O DeepSeek V4-Pro suporta uma API de estilo OpenAI. Faça login no site oficial do DeepSeek e defina <code translate="no">DEEPSEEK_API_KEY</code> como uma variável de ambiente.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Preparar o conjunto de dados de documentação do Milvus</h3><p>Usamos as páginas de FAQ do <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">arquivo de documentação do Milvus 2.4.x</a> como fonte de conhecimento privado. Este é um conjunto de dados inicial simples para uma pequena demonstração do RAG.</p>
<p>Primeiro, descarregue o ficheiro ZIP e extraia a documentação para a pasta <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Carregamos todos os ficheiros Markdown da pasta <code translate="no">milvus_docs/en/faq</code>. Para cada documento, dividimos o conteúdo do ficheiro por <code translate="no">#</code>, que separa aproximadamente as principais secções Markdown.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Configurar o DeepSeek V4 e o modelo de incorporação</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, escolha um modelo de incorporação. Este exemplo usa <code translate="no">DefaultEmbeddingFunction</code> do módulo de modelo PyMilvus. Consulte os documentos do Milvus para obter mais informações sobre <a href="https://milvus.io/docs/embeddings.md">funções de incorporação</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Gere um vetor de teste e, em seguida, imprima a dimensão do vetor e os primeiros elementos. A dimensão retornada é usada ao criar a coleção Milvus.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Carregar dados no Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Criar uma coleção Milvus</h3><p>Uma coleção Milvus armazena campos vetoriais, campos escalares e metadados dinâmicos opcionais. A configuração rápida abaixo utiliza a API de alto nível <code translate="no">MilvusClient</code>; para esquemas de produção, consulte os documentos sobre <a href="https://milvus.io/docs/manage-collections.md">gestão de colecções</a> e <a href="https://milvus.io/docs/create-collection.md">criação de colecções</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Algumas notas sobre <code translate="no">MilvusClient</code>:</p>
<ul>
<li>Definir <code translate="no">uri</code> para um ficheiro local, tal como <code translate="no">./milvus.db</code>, é a opção mais fácil porque utiliza automaticamente <a href="https://milvus.io/docs/milvus_lite.md">o Milvus Lite</a> e armazena todos os dados nesse ficheiro.</li>
<li>Se tiver um grande conjunto de dados, pode configurar um servidor Milvus de maior desempenho no <a href="https://milvus.io/docs/quickstart.md">Docker ou Kubernetes</a>. Nessa configuração, use o URI do servidor, como <code translate="no">http://localhost:19530</code>, como seu <code translate="no">uri</code>.</li>
<li>Se pretender utilizar <a href="https://docs.zilliz.com/">o Zilliz Cloud</a>, o serviço de nuvem totalmente gerido para o Milvus, defina <code translate="no">uri</code> e <code translate="no">token</code> para o <a href="https://docs.zilliz.com/docs/connect-to-cluster">ponto de extremidade público e a chave de API</a> do Zilliz Cloud.</li>
</ul>
<p>Verifique se a coleção já existe. Se existir, elimine-a.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Crie uma nova coleção com os parâmetros especificados. Se não especificarmos a informação do campo, o Milvus cria automaticamente um campo <code translate="no">id</code> por defeito como chave primária e um campo vetorial para armazenar dados vectoriais. Um campo JSON reservado armazena dados escalares que não estão definidos no esquema.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>A métrica <code translate="no">IP</code> significa a semelhança do produto interno. O Milvus também suporta outros tipos de métricas e opções de índices, dependendo do tipo de vetor e da carga de trabalho; consulte os guias sobre <a href="https://milvus.io/docs/id/metric.md">tipos de métricas</a> e <a href="https://milvus.io/docs/index_selection.md">seleção de índices</a>. A definição <code translate="no">Strong</code> é um dos <a href="https://milvus.io/docs/consistency.md">níveis de consistência</a> disponíveis.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Inserir os documentos incorporados</h3><p>Itere pelos dados de texto, crie embeddings e insira os dados no Milvus. Aqui, adicionamos um novo campo chamado <code translate="no">text</code>. Uma vez que não está explicitamente definido no esquema da coleção, é automaticamente adicionado ao campo JSON dinâmico reservado. Para metadados de produção, reveja <a href="https://milvus.io/docs/enable-dynamic-field.md">o suporte de campo dinâmico</a> e a <a href="https://milvus.io/docs/json-field-overview.md">visão geral do campo JSON</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Para conjuntos de dados maiores, o mesmo padrão pode ser alargado com a conceção explícita do esquema, <a href="https://milvus.io/docs/index-vector-fields.md">índices de campo vetorial</a>, índices escalares e operações do ciclo de vida dos dados, como <a href="https://milvus.io/docs/insert-update-delete.md">inserir, reinserir e eliminar</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Construir o fluxo de recuperação RAG<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Procurar contexto relevante no Milvus</h3><p>Vamos definir uma pergunta comum sobre o Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pesquise a pergunta na coleção e obtenha as três principais correspondências semânticas. Esta é uma <a href="https://milvus.io/docs/single-vector-search.md">pesquisa</a> básica <a href="https://milvus.io/docs/single-vector-search.md">de vetor único</a>. Na produção, pode combiná-la com a <a href="https://milvus.io/docs/filtered-search.md">pesquisa filtrada</a>, <a href="https://milvus.io/docs/full-text-search.md">a pesquisa de texto integral</a>, <a href="https://milvus.io/docs/multi-vector-search.md">a pesquisa híbrida multi-vetorial</a> e <a href="https://milvus.io/docs/reranking.md">as estratégias de reranking</a> para melhorar a relevância.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Agora vamos ver os resultados da pesquisa para a consulta.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Gerar uma resposta RAG com o DeepSeek V4</h3><p>Converta os documentos recuperados em formato de string.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Defina o sistema e os prompts do usuário para o LLM. Este prompt é montado a partir dos documentos recuperados do Milvus.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Use o modelo fornecido pelo DeepSeek V4-Pro para gerar uma resposta com base no prompt.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>Neste ponto, o pipeline concluiu o loop RAG principal: incorporar documentos, armazenar vetores no Milvus, pesquisar contexto relevante e gerar uma resposta com o DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">O que deve ser melhorado antes da produção?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>A demonstração usa a divisão de seção simples e a recuperação top-k. Isso é suficiente para mostrar a mecânica, mas o RAG de produção geralmente precisa de mais controle de recuperação.</p>
<table>
<thead>
<tr><th>Necessidade de produção</th><th>Funcionalidade Milvus a considerar</th><th>Porque é que ajuda</th></tr>
</thead>
<tbody>
<tr><td>Misturar sinais semânticos e de palavras-chave</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">pesquisa híbrida com Milvus</a></td><td>Combina a pesquisa vetorial densa com sinais esparsos ou de texto integral</td></tr>
<tr><td>Combinar resultados de vários recuperadores</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Recuperador de pesquisa híbrida Milvus</a></td><td>Permite que os fluxos de trabalho LangChain utilizem uma classificação ponderada ou do tipo RRF</td></tr>
<tr><td>Restringir resultados por locatário, carimbo de data/hora ou tipo de documento</td><td>Metadados e filtros escalares</td><td>Mantém a recuperação com o âmbito da fatia de dados correta</td></tr>
<tr><td>Passar do Milvus auto-gerido para o serviço gerido</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Migração do Milvus para o Zilliz</a></td><td>Reduz o trabalho de infraestrutura, mantendo a compatibilidade com o Milvus</td></tr>
<tr><td>Ligar aplicações alojadas de forma segura</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Chaves API do Zilliz Cloud</a></td><td>Fornece controlo de acesso baseado em tokens para clientes de aplicações</td></tr>
</tbody>
</table>
<p>O hábito de produção mais importante é avaliar a recuperação separadamente da geração. Se o contexto recuperado for fraco, a troca do LLM muitas vezes esconde o problema em vez de o resolver.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Introdução ao Milvus e ao DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Se você quiser reproduzir o tutorial, comece com a <a href="https://milvus.io/docs">documentação</a> oficial <a href="https://milvus.io/docs">do Milvus</a> e o <a href="https://milvus.io/docs/build-rag-with-milvus.md">guia Build RAG with Milvus</a>. Para uma configuração gerenciada, <a href="https://docs.zilliz.com/docs/connect-to-cluster">conecte-se ao Zilliz Cloud</a> com seu endpoint de cluster e chave de API em vez de executar o Milvus localmente.</p>
<p>Se quiser ajuda para ajustar o chunking, a indexação, os filtros ou a recuperação híbrida, junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> ou reserve uma <a href="https://milvus.io/office-hours">sessão</a> gratuita <a href="https://milvus.io/office-hours">do Milvus Office Hours</a>. Se você preferir ignorar a configuração da infraestrutura, use <a href="https://cloud.zilliz.com/login">o login do Zilliz Cloud</a> ou crie uma <a href="https://cloud.zilliz.com/signup">conta do Zilliz Cloud</a> para executar o Milvus gerenciado.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Perguntas que os desenvolvedores fazem sobre DeepSeek V4, Milvus e RAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">O DeepSeek V4 é bom para o RAG?</h3><p>O DeepSeek V4-Pro é uma boa opção para o RAG quando você precisa de processamento de contexto longo e menor custo de serviço do que os modelos fechados premium. Você ainda precisa de uma camada de recuperação como o Milvus para selecionar pedaços relevantes, aplicar filtros de metadados e manter o prompt focado.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">Devo usar o GPT-5.5 ou o DeepSeek V4 para um pipeline RAG?</h3><p>Use o GPT-5.5 quando a qualidade da resposta, o uso da ferramenta e a pesquisa em tempo real forem mais importantes do que o custo. Use o DeepSeek V4-Pro quando o processamento de contexto longo e o controle de custos forem mais importantes, especialmente se a camada de recuperação já fornecer contexto fundamentado de alta qualidade.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Posso executar o Qwen3.6-35B-A3B localmente para RAG privado?</h3><p>Sim, o Qwen3.6-35B-A3B tem um peso aberto e foi concebido para uma implementação mais controlável. É um bom candidato quando a privacidade, o serviço local, a entrada multimodal ou o desempenho em língua chinesa são importantes, mas ainda precisa de validar a latência, a memória e a qualidade da recuperação para o seu hardware.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">Os modelos de contexto longo tornam as bases de dados vectoriais desnecessárias?</h3><p>Não. Os modelos de contexto longo podem ler mais texto, mas continuam a beneficiar da recuperação. Uma base de dados vetorial limita a entrada a partes relevantes, suporta a filtragem de metadados, reduz o custo dos tokens e facilita a atualização da aplicação à medida que os documentos mudam.</p>
