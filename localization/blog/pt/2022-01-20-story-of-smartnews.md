---
id: 2022-01-20-story-of-smartnews.md
title: A história da SmartNews - de um utilizador Milvus a um colaborador ativo
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: 'Conheça a história da SmartNews, um utilizador e colaborador da Milvus.'
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>Este artigo foi traduzido por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
<p>A informação está em todo o lado nas nossas vidas. O Meta (anteriormente conhecido como Facebook), o Instagram, o Twitter e outras plataformas de redes sociais tornam os fluxos de informação ainda mais omnipresentes. Por conseguinte, os motores que lidam com esses fluxos de informação tornaram-se uma necessidade na maior parte da arquitetura dos sistemas. No entanto, como utilizador de plataformas de redes sociais e aplicações relevantes, aposto que deve ter sido incomodado por artigos, notícias, memes e outros conteúdos duplicados. A exposição a conteúdos duplicados dificulta o processo de recuperação de informação e conduz a uma má experiência do utilizador.</p>
<p>Para um produto que lida com fluxos de informação, é altamente prioritário que os criadores encontrem um processador de dados flexível que possa ser integrado sem problemas na arquitetura do sistema para deduplicar notícias ou anúncios idênticos.</p>
<p><a href="https://www.smartnews.com/en/">A SmartNews</a>, avaliada em <a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">2 mil milhões de dólares americanos</a>, é a empresa de aplicações noticiosas mais valorizada dos EUA. A SmartNews era um utilizador da Milvus, uma base de dados vetorial de código aberto, mas mais tarde tornou-se um colaborador ativo do projeto Milvus.</p>
<p>Este artigo partilha a história da SmartNews e explica por que razão decidiu contribuir para o projeto Milvus.</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">Uma visão geral da SmartNews<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>A SmartNews, fundada em 2012, tem sede em Tóquio, no Japão. A aplicação de notícias desenvolvida pela SmartNews foi sempre <a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">muito bem classificada</a> no mercado japonês. A SmartNews é a aplicação de notícias <a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">com o crescimento mais rápido</a> e também possui <a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">uma elevada viscosidade de utilizadores</a> no mercado dos EUA. De acordo com as estatísticas da <a href="https://www.appannie.com/en/">APP Annie</a>, a duração média mensal da sessão da SmartNews ficou em primeiro lugar entre todas as aplicações de notícias até ao final de julho de 2021, superior à duração acumulada da sessão da AppleNews e da Google News.</p>
<p>Com o rápido crescimento da base de utilizadores e da viscosidade, a SmartNews tem de enfrentar mais desafios em termos de mecanismo de recomendação e algoritmo de IA. Esses desafios incluem a utilização de caraterísticas discretas maciças na aprendizagem automática (ML) em grande escala, a aceleração da consulta de dados não estruturados com pesquisa de semelhança de vectores e muito mais.</p>
<p>No início de 2021, a equipa de algoritmos de anúncios dinâmicos da SmartNews enviou um pedido à equipa de infraestruturas de IA para otimizar as funções de recuperação e consulta de anúncios. Após dois meses de pesquisa, o engenheiro de infraestrutura de IA Shu decidiu usar o Milvus, um banco de dados vetorial de código aberto que suporta vários índices e métricas de similaridade e atualizações de dados online. O Milvus tem a confiança de mais de mil organizações em todo o mundo.</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">Recomendação de anúncios com base na pesquisa de semelhanças vectoriais<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>A base de dados de vectores de código aberto Milvus é adoptada no sistema de anúncios SmartNews para fazer corresponder e recomendar aos seus utilizadores anúncios dinâmicos a partir de um conjunto de dados à escala de 10 milhões. Ao fazê-lo, a SmartNews pode criar uma relação de mapeamento entre dois conjuntos de dados anteriormente incomparáveis - dados do utilizador e dados de anúncios. No segundo trimestre de 2021, Shu conseguiu implantar o Milvus 1.0 no Kubernetes. Saiba mais sobre como <a href="https://milvus.io/docs">implantar o Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Após a implementação bem-sucedida do Milvus 1.0, o primeiro projeto a utilizar o Milvus foi o projeto de recolha de anúncios iniciado pela equipa de anúncios da SmartNews. Durante a fase inicial, o conjunto de dados de anúncios estava numa escala de um milhão. Entretanto, a latência do P99 era rigorosamente controlada em menos de 10 milissegundos.</p>
<p>Em junho de 2021, Shu e os seus colegas da equipa de algoritmos aplicaram o Milvus a mais cenários empresariais e tentaram a agregação de dados e a atualização de dados/índice online em tempo real.</p>
<p>Até agora, a Milvus, a base de dados vetorial de código aberto, tem sido utilizada em vários cenários empresariais na SmartNews, incluindo a recomendação de anúncios.</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>De utilizador a colaborador ativo</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>Durante a integração do Milvus na arquitetura do produto Smartnews, Shu e outros programadores apresentaram pedidos de funções como hot reload, item TTL (time-to-live), atualização/substituição de itens, entre outras. Estas são também funções desejadas por muitos utilizadores da comunidade Milvus. Por conseguinte, Dennis Zhao, chefe da equipa de infra-estruturas de IA da SmartNews, decidiu desenvolver e contribuir com a função de carregamento a quente para a comunidade. Dennis acredita que "a equipa da SmartNews tem beneficiado da comunidade Milvus, pelo que estamos mais do que dispostos a contribuir se tivermos algo para partilhar com a comunidade".</p>
<p>O recarregamento de dados permite a edição de código durante a execução do código. Com a ajuda do recarregamento de dados, os programadores já não precisam de parar num ponto de interrupção ou reiniciar a aplicação. Em vez disso, podem editar o código diretamente e ver o resultado em tempo real.</p>
<p>No final de julho, Yusup, engenheiro da SmartNews, propôs a ideia de utilizar <a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">um alias de coleção</a> para conseguir um hot reload.</p>
<p>Criar um alias de coleção refere-se à especificação de nomes de alias para uma coleção. Uma coleção pode ter vários aliases. No entanto, um alias corresponde a um máximo de uma coleção. Basta fazer uma analogia entre uma coleção e um cacifo. Um cacifo, tal como uma coleção, tem o seu próprio número e posição, que permanecerão sempre inalterados. No entanto, pode sempre colocar e retirar coisas diferentes do cacifo. Da mesma forma, o nome da coleção é fixo, mas os dados da coleção são dinâmicos. É sempre possível inserir ou eliminar vectores numa coleção, uma vez que a eliminação de dados é suportada na <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">versão</a> Milvus <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">pré-GA</a>.</p>
<p>No caso da atividade publicitária SmartNews, são inseridos ou actualizados cerca de 100 milhões de vectores à medida que são gerados novos vectores de anúncios dinâmicos. Existem várias soluções para este problema:</p>
<ul>
<li>Solução 1: eliminar primeiro os dados antigos e inserir os novos.</li>
<li>Solução 2: criar uma nova coleção para os novos dados.</li>
<li>Solução 3: utilizar um alias de coleção.</li>
</ul>
<p>Para a solução 1, uma das deficiências mais evidentes é o facto de ser extremamente morosa, especialmente quando o conjunto de dados a atualizar é enorme. Geralmente, são necessárias horas para atualizar um conjunto de dados à escala de 100 milhões.</p>
<p>Quanto à solução 2, o problema é que a nova coleção não está imediatamente disponível para pesquisa. Ou seja, uma coleção não pode ser pesquisada durante o carregamento. Além disso, o Milvus não permite que duas colecções usem o mesmo nome de coleção. A mudança para uma nova coleção exigiria sempre que os utilizadores modificassem manualmente o código do lado do cliente. Ou seja, os utilizadores teriam de rever o valor do parâmetro <code translate="no">collection_name</code> sempre que precisassem de mudar de coleção.</p>
<p>A solução 3 seria a solução milagrosa. Basta inserir os novos dados numa nova coleção e utilizar o alias de coleção. Ao fazê-lo, basta trocar o alias de coleção sempre que for necessário mudar de coleção para efetuar a pesquisa. Não precisa de se esforçar mais para rever o código. Esta solução poupa-lhe os problemas mencionados nas duas soluções anteriores.</p>
<p>Yusup partiu deste pedido e ajudou toda a equipa SmartNews a compreender a arquitetura do Milvus. Após um mês e meio, o projeto Milvus recebeu um PR sobre hot reload da Yusup. E mais tarde, esta função está oficialmente disponível juntamente com o lançamento do Milvus 2.0.0-RC7.</p>
<p>Atualmente, a equipa de infra-estruturas de IA está a tomar a iniciativa de implementar o Milvus 2.0 e de migrar gradualmente todos os dados do Milvus 1.0 para o 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>Alias de coleção img_collection</span> </span></p>
<p>O suporte para o nome alternativo de coleção pode melhorar significativamente a experiência do utilizador, especialmente para as grandes empresas da Internet com grandes volumes de pedidos de utilizadores. Chenglong Li, engenheiro de dados da comunidade Milvus, que ajudou a construir a ponte entre o Milvus e o Smartnews, disse: "A função de alias de coleção surge de um pedido real da SmartNews, um utilizador do Milvus. E a SmartNews contribuiu com o código para a comunidade Milvus. Este ato de reciprocidade é um excelente exemplo do espírito de código aberto: da comunidade e para a comunidade. Esperamos ver mais colaboradores como a SmartNews e construir em conjunto uma comunidade Milvus mais próspera."</p>
<p>"Atualmente, parte do negócio da publicidade está a adotar o Milvus como base de dados vetorial offline. O lançamento oficial do Mivus 2.0 está a aproximar-se e esperamos poder utilizar o Milvus para criar sistemas mais fiáveis e fornecer serviços em tempo real para mais cenários empresariais", afirmou Dennis.</p>
<blockquote>
<p>Atualização: O Milvus 2.0 já está disponível para todos! <a href="/blog/pt/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Saiba mais</a></p>
</blockquote>
