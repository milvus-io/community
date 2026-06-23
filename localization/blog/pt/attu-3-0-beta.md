---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta: Gestão de vários clusters, agente de IA e uma consola Milvus
  renovada
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/Attu_3_0_New_cover_1af4c44467.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  A versão beta do Attu 3.0 renova a consola de gestão do Milvus com gestão
  multicluster, estado persistente, um agente de IA integrado, diagnósticos
  avançados, métricas em tempo real, depuração de API, cópia de segurança e
  restauração, e fluxos de trabalho RBAC simplificados.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>O Attu 3.0 Beta já está disponível.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>O Attu</strong></a> é a consola de gestão de código aberto para <a href="https://milvus.io"><strong>o Milvus</strong></a>. Se já utilizou o Milvus localmente ou em produção, provavelmente já utilizou o Attu para inspecionar coleções, navegar pelos dados, gerir esquemas ou verificar o que se passa no interior de um cluster.</p>
<p>O Attu 2.x funcionava bem para a gestão básica de um único cluster. No entanto, à medida que as implementações do Milvus cresceram, as suas limitações tornaram-se mais evidentes. Só conseguia ligar-se a uma instância do Milvus de cada vez. O estado da ligação era perdido após o reinício de um contentor. A navegação pelos dados era, na sua maioria, centrada nas coleções. O diagnóstico, a monitorização, a depuração da API, o backup e a restauração, bem como a gestão de permissões, exigiam frequentemente ferramentas separadas ou passos manuais.</p>
<p><strong>O Attu 3.0 Beta é uma reconstrução completa da experiência de gestão do Milvus.</strong></p>
<p>Esta versão adiciona gestão de múltiplos clusters, estado local persistente, um Agente de IA integrado com mais de 50 ferramentas do Milvus, capacidades de diagnóstico especializadas, um navegador de dados redesenhado, métricas do Prometheus integradas, um API Playground, cópias de segurança e restaurações baseadas em GUI e fluxos de trabalho RBAC simplificados.</p>
<p>Em suma, o Attu já não é apenas um visualizador leve para uma instância do Milvus. Está a tornar-se uma consola de operações prática para programadores e equipas que gerem o Milvus em ambientes locais, de teste e de produção.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">O que mudou no Attu 3.0 Beta<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>Aqui está uma comparação geral entre o Attu 2.x e o Attu 3.0 Beta.</p>
<table>
<thead>
<tr><th>Funcionalidade</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>Ligações em cluster</td><td>Apenas uma instância</td><td>Vários clusters com alternância com um clique</td></tr>
<tr><td>Persistência de estado</td><td>Sem estado; perde-se ao reiniciar o contentor</td><td>Base de dados local; mantém-se após reinícios</td></tr>
<tr><td>Assistência por IA</td><td>Nenhuma</td><td>Agente integrado com mais de 50 ferramentas Milvus</td></tr>
<tr><td>Diagnóstico</td><td>Investigação manual</td><td>4 competências de diagnóstico integradas de nível especializado</td></tr>
<tr><td>Gestão RBAC</td><td>Páginas separadas, fluxo em várias etapas</td><td>Criação de utilizadores no contexto, com um único clique</td></tr>
<tr><td>Navegação nos dados</td><td>Lista plana de coleções</td><td>Árvore hierárquica: base de dados → coleção → partição</td></tr>
<tr><td>Monitorização</td><td>Requer Grafana externo</td><td>Painel de métricas Prometheus integrado</td></tr>
<tr><td>Depuração de API</td><td>Ferramentas externas, como o curl ou o Postman</td><td>Playground da API REST integrado</td></tr>
<tr><td>Cópia de segurança e restauração</td><td>Apenas CLI</td><td>GUI com suporte para S3, MinIO, GCS e Azure</td></tr>
<tr><td>Integração com LLM</td><td>Nenhuma</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini e muito mais</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">Gerir vários clusters Milvus a partir de uma única barra lateral<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>A maior mudança no dia-a-dia é a gestão de múltiplos clusters.</strong> O Attu 3.0 pode ligar-se a todas as instâncias do Milvus que executar e listá-las numa única barra lateral.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: Barra lateral do Attu 3.0 a mostrar várias ligações Milvus com indicadores de estado</p>
<p>No Attu 2.x, mudar de um cluster Milvus para outro implicava desligar, voltar a ligar e esperar. Se tivesse clusters separados para desenvolvimento, staging, produção ou diferentes linhas de negócio, acabava frequentemente por ter um separador do navegador por cada cluster.</p>
<p>O Attu 3.0 substitui esse fluxo por uma barra lateral esquerda persistente. Todas as ligações ao Milvus são listadas num único local, com um indicador de estado em tempo real ao lado. Um ponto verde significa que o cluster está acessível. Um ponto vermelho significa que o cluster está em baixo ou indisponível.</p>
<p>Mudar de cluster requer apenas um clique. O Attu mantém o contexto de cada ligação, pelo que não é necessário voltar a ligar-se sempre que se muda de ambiente.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">A configuração da ligação é menos frágil</h3><p>As novas ligações suportam encriptação TLS/SSL, autenticação por token e autenticação por nome de utilizador/palavra-passe. Pode testar uma ligação antes de a guardar, manter os detalhes da ligação localmente e eliminar em massa ligações inativas quando os ambientes antigos já não forem necessários.</p>
<p><strong>Cada cluster tem o seu próprio espaço de trabalho.</strong> A visão geral, o navegador de dados, a gestão de utilizadores, as métricas e as operações estão todas limitadas ao cluster atualmente selecionado. Isso torna muito mais difícil confundir o ambiente de teste com o de produção ou executar uma operação no local errado.</p>
<p>Para quem gere mais do que uma instância do Milvus, esta é uma das alterações mais importantes do Attu 3.0. Pode parecer básico, mas elimina uma grande quantidade de alternâncias entre separadores e o incómodo de ter de se reconectar no trabalho diário com o Milvus.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">O estado local agora mantém-se após reinícios<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>O Attu 2.x não mantinha o estado. Se o contentor fosse reiniciado, as informações de ligação guardadas desapareciam e era necessário reconstruir o espaço de trabalho.</p>
<p><strong>O Attu 3.0 adiciona uma base de dados local que mantém as configurações do cluster, o histórico de conversas do agente, as competências personalizadas, a configuração do LLM e as preferências do utilizador.</strong></p>
<p>Ao executar o Attu com o Docker, monte um volume para manter esse estado:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Com o volume montado, reiniciar o contentor já não significa começar do zero.</p>
<p>Isto também é importante para o novo Agente de IA. O histórico de conversas, as competências personalizadas e a configuração do LLM podem ser mantidos localmente, pelo que o Attu se torna uma consola que pode continuar a utilizar ao longo do tempo, em vez de uma interface de utilizador temporária que é reiniciada após cada reinício.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">Utilize o Agente de IA integrado para operar o Milvus em linguagem natural<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>O Attu 3.0 inclui um Agente de IA integrado para a gestão do Milvus. Não se trata de um chatbot de documentação. <strong>O agente está ligado a mais de 50 ferramentas do Milvus, pelo que pode inspecionar o estado do cluster e executar operações reais através do Attu.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: O agente de IA do Attu 3.0 pode acionar ferramentas do Milvus a partir de pedidos em linguagem natural</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">Mais de 50 ferramentas integradas em fluxos de trabalho comuns do Milvus</h3><p>O agente abrange operações diárias, diagnósticos, permissões e gestão do cluster. Pode fazer perguntas ou dar instruções como:</p>
<table>
<thead>
<tr><th>Cenário</th><th>Exemplos de comandos</th></tr>
</thead>
<tbody>
<tr><td>Operações diárias</td><td>«Lista todas as minhas coleções.»<br>«Cria uma coleção com os campos id, título e incorporação. Utiliza a dimensão 768 para o campo de incorporação.»<br>«Insira alguns dados de teste na minha_coleção.»<br>«Pesquise na minha_coleção os 10 registos mais semelhantes a “inteligência artificial”.»</td></tr>
<tr><td>Operações e diagnóstico</td><td>«O meu cluster está em bom estado?»<br>«Porque é que a pesquisa está tão lenta?»<br>«Quais são as coleções que consomem mais memória?»<br>«Houve alguma consulta lenta recentemente?»</td></tr>
<tr><td>Permissões</td><td>«Crie um utilizador só de leitura chamado analyst.»<br>«Conceda todos os privilégios à função de administrador.»<br>«Verifique quais são os privilégios do utilizador zhangsan.»</td></tr>
<tr><td>Gestão do cluster</td><td>«Mostrar a versão e a configuração atuais do Milvus.»<br>«Listar a utilização do grupo de recursos.»<br>«Compacta a minha_coleção por mim.»</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">As ações destrutivas requerem aprovação</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: As operações destrutivas ou sensíveis apresentam uma caixa de diálogo de confirmação antes da execução</p>
<p><strong>O agente foi concebido para ser transparente e controlável.</strong> As operações não destrutivas, tais como listar coleções ou ler métricas, devolvem os resultados diretamente.</p>
<p>Operações destrutivas ou sensíveis, como eliminar uma coleção, limpar dados ou alterar privilégios, acionam uma caixa de diálogo de confirmação. A caixa de diálogo lista os parâmetros exatos e aguarda aprovação antes de a operação ser executada.</p>
<p>Também é possível ver quais as ferramentas que o agente chamou, quantos tokens utilizou e se alguma chamada de ferramenta falhou. Isso é importante para um agente de gestão de bases de dados. Os utilizadores devem ser capazes de compreender o que o agente fez, e não apenas ver o resultado final.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Executar competências de diagnóstico especializadas a partir da consola<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Agente de IA inclui quatro competências de diagnóstico integradas.</strong> Trata-se de fluxos de trabalho guiados para cenários comuns de resolução de problemas do Milvus, e não de prompts genéricos.</p>
<table>
<thead>
<tr><th>Competência de diagnóstico</th><th>O que verifica</th></tr>
</thead>
<tbody>
<tr><td>Diagnóstico do estado do cluster</td><td>Versão, estado dos nós, integridade de cada componente e métricas-chave.</td></tr>
<tr><td>Diagnóstico do desempenho da pesquisa</td><td>Integridade do índice, fragmentação de segmentos, equilíbrio das réplicas e sinais relacionados com o desempenho da pesquisa.</td></tr>
<tr><td>Diagnóstico da gravação de dados</td><td>Inserções lentas, verificações de dados perdidos, anomalias de flush e sintomas no caminho de gravação.</td></tr>
<tr><td>Auditoria de configuração</td><td>Definições arriscadas ou incorretas que podem afetar a estabilidade, o desempenho ou o comportamento esperado.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: O Attu 3.0 inclui competências de diagnóstico integradas e suporta competências personalizadas</p>
<p>Também é possível criar competências personalizadas em linguagem natural. Uma competência pode codificar uma lista de verificação pré-lançamento, uma verificação da qualidade dos dados para uma recolha específica ou um fluxo de diagnóstico que a sua equipa executa para uma carga de trabalho conhecida.</p>
<p>Uma competência personalizada é, essencialmente, conhecimento de domínio aliado a um procedimento. Uma vez guardada, o agente pode reutilizá-la, em vez de depender de um prompt pontual de cada vez.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">Traga o seu próprio fornecedor de LLM<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Attu não inclui nem atua como proxy de um serviço LLM.</strong> Configure o seu próprio fornecedor e mantenha o controlo do percurso do modelo.</p>
<p>As opções de fornecedores suportadas incluem OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter e pontos finais personalizados compatíveis com a OpenAI.</p>
<table>
<thead>
<tr><th>Fornecedor</th><th>Modelos de exemplo</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>Qualquer modelo de encaminhamento</td></tr>
<tr><td>Ponto de extremidade personalizado</td><td>Qualquer API compatível com a OpenAI</td></tr>
</tbody>
</table>
<p>A sua chave de API é encriptada localmente e não é carregada para um serviço gerido pela Attu. Este design é importante para equipas que pretendem assistência de IA, mas que ainda assim precisam de controlar as credenciais, o fluxo de dados e a escolha do fornecedor.</p>
<p>Na prática, o BYOL torna o agente utilizável em diferentes ambientes. Uma equipa pode utilizar a OpenAI. Outra pode utilizar um modelo da Anthropic. Uma terceira pode encaminhar através de um ponto de extremidade compatível com a OpenAI. A Attu não impõe um único fornecedor de modelos.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Navegue pelos dados do Milvus com uma árvore de «Base de dados» → «Coleção» → «Partição»<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>O Attu 3.0 também redesenha o navegador de dados. O Attu 2.x apresentava principalmente uma lista plana de coleções. Isso torna-se difícil de utilizar quando um cluster tem várias bases de dados, dezenas de coleções e dados particionados.</p>
<p><strong>O novo navegador utiliza uma hierarquia que corresponde à forma como o Milvus organiza os dados: base de dados → coleção → partição.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: O navegador de dados redesenhado utiliza navegação hierárquica para bases de dados, coleções e partições</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">As operações de dados estão mais próximas do local onde navega</h3><p>O navegador de dados mantém as operações que os utilizadores já esperam e adiciona mais ações diretamente na interface do utilizador:</p>
<ul>
<li>Arraste e solte uma coleção para outro banco de dados.</li>
<li>Execute uma pesquisa vetorial digitando texto diretamente, quando um modelo de incorporação estiver configurado.</li>
<li>Inspecione pontuações de similaridade e refine os resultados com facetas.</li>
<li>Importe e exporte dados em CSV, JSON e Parquet.</li>
<li>Visualizar e editar um esquema de coleção visualmente, incluindo suporte a campos dinâmicos.</li>
<li>Crie, elimine e analise partições e estatísticas de partição.</li>
<li>Gerir todo o ciclo de vida da coleção: criar, carregar, libertar, copiar, renomear, mover entre bases de dados e eliminar.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: Navegador de dados do Attu 3.0 com pesquisa vetorial e análise de resultados</p>
<p>A maioria destas ações está disponível através de menus de clique com o botão direito do rato ou painéis de operações. Para tarefas comuns relacionadas com coleções, já não é necessário alternar entre a navegação na interface do utilizador e as operações na linha de comandos.</p>
<p>O Attu 3.0 é também a linha de produtos onde o suporte da interface de utilizador para as novas capacidades <a href="https://milvus.io/docs/release_notes.md">do Milvus 3.0</a>, tais como instantâneos e vetores nulos, continuará a ser implementado à medida que essas funcionalidades amadurecem.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Verifique operações, métricas, consultas lentas, topologia e cópias de segurança num único local<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Attu 3.0 disponibiliza mais informações operacionais na consola.</strong> A área de Operações e Monitorização inclui uma visão geral do cluster, métricas em tempo real, análise de consultas lentas, topologia e cópias de segurança e restauração.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: Página «Ops e Monitorização» do Attu 3.0</p>
<p>O objetivo não é substituir todos os sistemas de observabilidade que uma equipa de produção já utiliza. As equipas podem continuar a utilizar o Prometheus, o Grafana, registos, alertas e a sua pilha de monitorização existente. O objetivo é permitir que as perguntas comuns sobre o Milvus sejam respondidas a partir do próprio Attu.</p>
<table>
<thead>
<tr><th>Área</th><th>O que pode fazer</th></tr>
</thead>
<tbody>
<tr><td>Visão geral visual do cluster</td><td>Visualize de um só olhar a versão do Milvus, o modo de implementação, o número de nós, o número de bases de dados, o número de coleções, o estado de carga e as entidades de quota.</td></tr>
<tr><td>Métricas em tempo real</td><td>Analise o QPS, as taxas de inserção/eliminação, a latência das consultas, a taxa de acertos no cache e métricas relacionadas suportadas pelo Prometheus.</td></tr>
<tr><td>Análise de consultas lentas</td><td>Analise as consultas lentas por tipo, duração, coleção, carimbo de data/hora, origem e contexto de resolução de problemas relacionado.</td></tr>
<tr><td>Visão da topologia</td><td>Compreenda a topologia dos nós e as ligações entre componentes como o RootCoord, o DataCoord, o IndexCoord, o QueryCoord e o Proxy.</td></tr>
<tr><td>Cópia de segurança e restauração</td><td>Crie cópias de segurança completas ou incrementais para o S3, MinIO, GCS ou Azure e descarregue os metadados da cópia de segurança num ficheiro ZIP ou carregue um para restaurar.</td></tr>
</tbody>
</table>
<p>O backup e a restauração são especialmente importantes porque transferem um fluxo de trabalho que anteriormente dependia da utilização da CLI para a GUI. Isso é útil para testes locais, validação em ambiente de teste e equipas que pretendem um caminho de recuperação mais visível.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">Depurar as APIs REST do Milvus com o API Playground integrado<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Attu 3.0 adiciona um API Playground REST para o desenvolvimento e depuração da API do Milvus.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: API Playground do Attu 3.0</p>
<p>O Playground cataloga os endpoints REST do Milvus por categoria. Selecione uma base de dados e uma coleção, e o Attu preenche automaticamente o contexto de execução. A partir daí, pode enviar um pedido com um clique e inspecionar a resposta em tempo real.</p>
<p>Isto é útil quando se pretende testar uma chamada de API sem ter de configurar comandos curl ou uma coleção do Postman. Também é útil para compreender como uma funcionalidade do Milvus se mapeia para a API REST, uma vez que é possível alternar diretamente entre o contexto da interface do utilizador e o corpo da solicitação.</p>
<p>Para os programadores de aplicações, o API Playground é uma ferramenta de depuração. Para novos utilizadores do Milvus, é uma ferramenta de aprendizagem. Para as equipas da plataforma, é uma forma rápida de validar operações antes de as transformar em scripts ou código de aplicação.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">Gerir o RBAC junto da base de dados ou da coleção<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Attu 3.0 altera a forma como os fluxos de trabalho de permissões são apresentados na interface do utilizador.</strong> Em vez de tratar <a href="https://milvus.io/docs/rbac.md">o RBAC</a> como uma tarefa administrativa separada, aproxima o controlo de acesso das separadores da base de dados e da coleção, onde os utilizadores já estão a trabalhar.</p>
<p>O modelo subjacente continua a ser o RBAC do Milvus: utilizadores, funções, <a href="https://milvus.io/docs/grant_privileges.md">privilégios</a>, concessões e revogações. O Attu 3.0 simplifica o fluxo de trabalho em torno desse modelo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagem: Gestão de utilizadores e permissões no contexto do Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">Criação de utilizadores com um clique para âmbitos comuns</h3><p>No Attu 2.x, conceder acesso de leitura a uma coleção envolvia normalmente vários passos: criar o utilizador, criar uma função, configurar privilégios, atribuir a função ao utilizador e garantir que o âmbito estava correto.</p>
<p><strong>No Attu 3.0, pode abrir uma coleção, aceder ao separador «Utilizadores», clicar em «Criar Utilizador», escolher «Apenas Leitura» ou «Leitura e Escrita» e deixar que o Attu conclua o fluxo de trabalho.</strong> O sistema cria o utilizador, gera uma palavra-passe segura, cria a função com o âmbito correspondente e aplica a concessão.</p>
<p>O mesmo padrão funciona ao nível da base de dados. Também é possível autorizar um utilizador existente a aceder à coleção atual ou revogar o acesso com um único clique.</p>
<p>Isto mantém a gestão de permissões próxima do recurso que está a ser protegido. Não é necessário percorrer várias páginas de administração nem lembrar-se de uma convenção de nomenclatura de funções apenas para conceder a um colega de equipa acesso com âmbito específico.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">O que esta versão beta significa para os utilizadores do Attu<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>A versão beta do Attu 3.0 é a maior atualização da consola de gestão do Milvus desde o lançamento inicial do Attu.</strong> Não se trata apenas de uma renovação visual. Altera o âmbito do que o Attu consegue gerir.</p>
<p>A principal novidade é que o Attu agora adapta-se à forma como muitos utilizadores do Milvus trabalham na prática: vários clusters, definições locais persistentes, maior movimentação de dados, maior controlo de acesso, mais resolução de problemas e uma maior necessidade de compreender o comportamento dos clusters sem ter de alternar entre ferramentas.</p>
<p>Os destaques são:</p>
<ul>
<li>Gestão de múltiplos clusters com indicadores de estado e alternância com um clique.</li>
<li>Estado local persistente para configurações de clusters, preferências, configuração de LLM, histórico do agente e competências personalizadas.</li>
<li>Um agente de IA integrado com mais de 50 ferramentas do Milvus e portas de confirmação para ações destrutivas.</li>
<li>Quatro competências de diagnóstico especializadas integradas para a integridade do cluster, desempenho de pesquisa, gravações de dados e revisão da configuração.</li>
<li>Um navegador de dados redesenhado com navegação por base de dados → coleção → partição e operações de coleção mais avançadas.</li>
<li>Métricas Prometheus integradas, análise de consultas lentas, topologia e cópia de segurança e restauração.</li>
<li>Um «Playground» da API REST para depuração e aprendizagem das APIs do Milvus.</li>
<li>Fluxos de trabalho RBAC que ocorrem junto ao banco de dados ou à coleção, e não apenas num fluxo de administração separado.</li>
</ul>
<p>Se utilizar o Attu apenas para desenvolvimento local do Milvus, a versão 3.0 oferece-lhe uma consola mais capaz. Se gerir vários ambientes Milvus, só as alterações relacionadas com o suporte a vários clusters e o estado persistente já valem a pena experimentar. Se costuma depurar problemas de desempenho ou de permissões, o Agente, os diagnósticos, as métricas e os fluxos de trabalho RBAC no contexto devem poupar-lhe tempo imediatamente.</p>
<h2 id="Get-Started" class="common-anchor-header">Comece já<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Experimente o Attu 3.0 Beta com o Docker:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, abra:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Adicione a sua ligação ao Milvus a partir da barra lateral e comece a explorar o novo console.</p>
<p>Prefere uma aplicação para computador? Descarregue a versão para a sua plataforma a partir <a href="https://github.com/zilliztech/attu/releases"><strong>do GitHub Releases</strong></a>. O Attu 3.0 Beta disponibiliza pacotes para macOS, Linux e Windows. As versões mais recentes incluem também um pacote de servidor Linux autónomo para executar o Attu sem o Docker ou o Electron.</p>
<p><strong>Tem dúvidas?</strong> Partilhe a sua configuração com vários clusters, as suas competências de agente personalizadas ou o seu cenário de diagnóstico no <a href="https://discord.gg/milvus"><strong>Discord do Milvus</strong></a>, ou marque um horário <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>no Milvus Office Hours</strong></a> para resolver a questão com a comunidade.</p>
<p><strong>Não quer gerir a infraestrutura do Milvus por conta própria?</strong> <a href="https://cloud.zilliz.com/signup"><strong>A Zilliz Cloud</strong></a> é a plataforma totalmente gerida pelos criadores do Milvus. Mantém a API do Milvus e adiciona infraestrutura gerida para pesquisa vetorial em tempo real, descoberta em grande escala e operações de dados com IA. Para equipas com requisitos de soberania de dados, o Zilliz Cloud <strong>BYOC</strong> funciona dentro da sua própria conta na nuvem, pelo que os dados permanecem na sua VPC enquanto a Zilliz trata das operações.</p>
