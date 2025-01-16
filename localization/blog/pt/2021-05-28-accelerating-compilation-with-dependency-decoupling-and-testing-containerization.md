---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: >-
  Acelerando a compilação 2,5 vezes com desacoplamento de dependência e teste de
  conteinerização
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: >-
  Descubra como o zilliz reduziu os tempos de compilação em 2,5x usando técnicas
  de desacoplamento de dependência e conteinerização para projetos de IA e MLOps
  em grande escala.
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>Acelerando a compilação em 2,5 vezes com o desacoplamento de dependências e a conteinerização de testes</custom-h1><p>O tempo de compilação pode ser agravado por dependências internas e externas complexas que evoluem ao longo do processo de desenvolvimento, bem como por alterações nos ambientes de compilação, como o sistema operacional ou as arquiteturas de hardware. A seguir estão os problemas comuns que podem ser encontrados ao trabalhar em projetos de IA ou MLOps em grande escala:</p>
<p><strong>Compilação proibitivamente longa</strong> - A integração de código é efectuada centenas de vezes por dia. Com centenas de milhares de linhas de código em vigor, mesmo uma pequena alteração pode resultar numa compilação completa que, normalmente, demora uma ou mais horas.</p>
<p><strong>Ambiente de compilação complexo</strong> - O código do projeto tem de ser compilado em diferentes ambientes, que envolvem diferentes sistemas operativos, como o CentOS e o Ubuntu, dependências subjacentes, como o GCC, o LLVM e o CUDA, e arquitecturas de hardware. E a compilação num ambiente específico pode normalmente não funcionar num ambiente diferente.</p>
<p><strong>Dependências complexas</strong> - A compilação de projectos envolve mais de 30 dependências entre componentes e de terceiros. O desenvolvimento do projeto conduz frequentemente a alterações nas dependências, causando inevitavelmente conflitos de dependências. O controlo de versões entre dependências é tão complexo que a atualização da versão das dependências afectará facilmente outros componentes.</p>
<p><strong>O descarregamento de dependências de terceiros é lento ou falha</strong> - Atrasos na rede ou bibliotecas de dependências de terceiros instáveis causam lentidão no descarregamento de recursos ou falhas de acesso, afectando seriamente a integração do código.</p>
<p>Ao dissociar as dependências e implementar a contentorização de testes, conseguimos diminuir o tempo médio de compilação em 60% enquanto trabalhávamos no projeto open-source de pesquisa de semelhanças de embeddings <a href="https://milvus.io/">Milvus</a>.</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">Desacoplar as dependências do projeto</h3><p>A compilação de projectos envolve normalmente um grande número de dependências de componentes internos e externos. Quanto mais dependências um projeto tiver, mais complexa se torna a sua gestão. À medida que o software cresce, torna-se mais difícil e dispendioso alterar ou remover dependências, bem como identificar os efeitos de o fazer. É necessária uma manutenção regular ao longo do processo de desenvolvimento para garantir que as dependências funcionam corretamente. Uma manutenção deficiente, dependências complexas ou dependências defeituosas podem causar conflitos que atrasam ou impedem o desenvolvimento. Na prática, isso pode significar atrasos no download de recursos, falhas de acesso que afetam negativamente a integração do código e muito mais. O desacoplamento das dependências do projeto pode atenuar os defeitos e reduzir o tempo de compilação, acelerando os testes do sistema e evitando atrasos desnecessários no desenvolvimento do software.</p>
<p>Por isso, recomendamos dissociar as dependências do seu projeto:</p>
<ul>
<li>Dividir componentes com dependências complexas</li>
<li>Utilizar diferentes repositórios para a gestão de versões.</li>
<li>Utilize ficheiros de configuração para gerir informações sobre versões, opções de compilação, dependências, etc.</li>
<li>Adicione os ficheiros de configuração às bibliotecas de componentes, para que sejam actualizados à medida que o projeto é iterado.</li>
</ul>
<p>Otimização<strong>da compilação entre componentes</strong> - Puxe e compile o componente relevante de acordo com as dependências e as opções de compilação registadas nos ficheiros de configuração. Marque e empacote os resultados da compilação binária e os ficheiros de manifesto correspondentes e, em seguida, carregue-os no seu repositório privado. Se nenhuma alteração for feita a um componente ou aos componentes dos quais ele depende, reproduza os resultados da compilação de acordo com os arquivos de manifesto. Para problemas como atrasos de rede ou bibliotecas de dependência de terceiros instáveis, tente configurar um repositório interno ou usar repositórios espelhados.</p>
<p>Para otimizar a compilação entre componentes:</p>
<p>1.Criar gráfico de relação de dependência - Use os arquivos de configuração nas bibliotecas de componentes para criar gráfico de relação de dependência. Utilize a relação de dependência para obter as informações de versão (Git Branch, Tag e Git commit ID) e as opções de compilação, entre outros, dos componentes dependentes a montante e a jusante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2.<strong>verificar dependências</strong> - Gerar alertas para dependências circulares, conflitos de versão e outros problemas que surgem entre componentes.</p>
<p>3<strong>.Achatar dependências</strong> - Classifique as dependências por Depth First Search (DFS) e componentes de mesclagem frontal com dependências duplicadas para formar um gráfico de dependências.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4. usar o algoritmo MerkleTree para gerar um hash (Root Hash) contendo dependências de cada componente com base em informações de versão, opções de compilação e muito mais. Combinado com informações como o nome do componente, o algoritmo forma uma etiqueta exclusiva para cada componente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>5. com base nas informações da etiqueta exclusiva do componente, verifique se existe um arquivo de compilação correspondente no repositório privado. Se for recuperado um arquivo de compilação, descompacte-o para obter o ficheiro de manifesto para reprodução; caso contrário, compile o componente, marque os ficheiros de objectos de compilação e o ficheiro de manifesto gerados e carregue-os no repositório privado.</p>
<p><br/></p>
<p><strong>Implementar optimizações de compilação nos componentes</strong> - Escolha uma ferramenta de cache de compilação específica da linguagem para armazenar em cache os ficheiros de objectos compilados e carregue-os e armazene-os no seu repositório privado. Para a compilação de C/C++, escolha uma ferramenta de cache de compilação como o CCache para armazenar em cache os arquivos intermediários de compilação de C/C++ e, em seguida, arquive o cache local do CCache após a compilação. Essas ferramentas de cache de compilação simplesmente armazenam em cache os arquivos de código alterados um a um após a compilação e copiam os componentes compilados do arquivo de código inalterado para que eles possam estar diretamente envolvidos na compilação final. A otimização da compilação nos componentes inclui as seguintes etapas:</p>
<ol>
<li>Adicionar as dependências de compilação necessárias ao Dockerfile. Use o Hadolint para executar verificações de conformidade no Dockerfile para garantir que a imagem esteja em conformidade com as práticas recomendadas do Docker.</li>
<li>Espelhe o ambiente de compilação de acordo com a versão do sprint do projeto (versão + compilação), o sistema operacional e outras informações.</li>
<li>Execute o contêiner do ambiente de compilação espelhado e transfira a ID da imagem para o contêiner como uma variável de ambiente. Aqui está um exemplo de comando para obter o ID da imagem: "docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7".</li>
<li>Escolha a ferramenta de cache de compilação adequada: Introduza o seu containter para integrar e compilar os seus códigos e verifique no seu repositório privado se existe uma cache de compilação adequada. Em caso afirmativo, descarregue-a e extraia-a para o diretório especificado. Depois de todos os componentes serem compilados, a cache gerada pela ferramenta de cache de compilação é empacotada e carregada no seu repositório privado com base na versão do projeto e na ID da imagem.</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">Otimização adicional da compilação</h3><p>A nossa compilação inicial ocupa demasiado espaço em disco e largura de banda de rede, e demora muito tempo a ser implementada, pelo que tomámos as seguintes medidas:</p>
<ol>
<li>Escolher a imagem de base mais simples para reduzir o tamanho da imagem, por exemplo, alpine, busybox, etc.</li>
<li>Reduzir o número de camadas de imagem. Reutilizar as dependências o máximo possível. Junte vários comandos com "&amp;&amp;".</li>
<li>Limpar os produtos intermédios durante a construção da imagem.</li>
<li>Utilizar a cache de imagem para construir a imagem tanto quanto possível.</li>
</ol>
<p>À medida que o nosso projeto continua a progredir, a utilização do disco e os recursos de rede começaram a subir à medida que a cache de compilação aumentava, enquanto algumas das caches de compilação eram subutilizadas. Fizemos então os seguintes ajustes:</p>
<p>Limpar<strong>regularmente os ficheiros de cache</strong> - Verificar regularmente o repositório privado (utilizando scripts, por exemplo) e limpar os ficheiros de cache que não foram alterados durante algum tempo ou que não foram descarregados muitas vezes.</p>
<p><strong>Cache de compilação seletivo</strong> - Armazene em cache apenas as compilações que exigem muitos recursos e ignore as compilações em cache que não exigem muitos recursos.</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">Aproveitar os testes em contêineres para reduzir erros, melhorar a estabilidade e a confiabilidade</h3><p>Os códigos têm de ser compilados em diferentes ambientes, que envolvem uma variedade de sistemas operativos (por exemplo, CentOS e Ubuntu), dependências subjacentes (por exemplo, GCC, LLVM e CUDA) e arquitecturas de hardware específicas. O código que compila com sucesso em um ambiente específico falha em um ambiente diferente. Ao executar testes dentro de contêineres, o processo de teste se torna mais rápido e mais preciso.</p>
<p>A conteinerização garante que o ambiente de teste seja consistente e que um aplicativo esteja funcionando conforme o esperado. A abordagem de teste em contêineres empacota os testes como contêineres de imagem e cria um ambiente de teste verdadeiramente isolado. Nossos testadores acharam essa abordagem bastante útil, o que acabou reduzindo os tempos de compilação em até 60%.</p>
<p><strong>Garantir um ambiente de compilação consistente</strong> - Como os produtos compilados são sensíveis a alterações no ambiente do sistema, podem ocorrer erros desconhecidos em diferentes sistemas operativos. Temos de marcar e arquivar a cache de produtos compilados de acordo com as alterações no ambiente de compilação, mas são difíceis de categorizar. Por isso, introduzimos a tecnologia de contentorização para unificar o ambiente de compilação e resolver estes problemas.</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusão</h3><p>Ao analisar as dependências do projeto, este artigo apresenta diferentes métodos para otimização da compilação entre e dentro dos componentes, fornecendo ideias e melhores práticas para criar uma integração de código contínua estável e eficiente. Esses métodos ajudaram a resolver a lentidão da integração de código causada por dependências complexas, unificar operações dentro do contêiner para garantir a consistência do ambiente e melhorar a eficiência da compilação por meio da reprodução dos resultados da compilação e do uso de ferramentas de cache de compilação para armazenar em cache os resultados intermediários da compilação.</p>
<p>Estas práticas acima mencionadas reduziram o tempo de compilação do projeto em 60%, em média, melhorando consideravelmente a eficiência global da integração do código. No futuro, continuaremos a paralelizar a compilação entre e dentro dos componentes para reduzir ainda mais os tempos de compilação.</p>
<p><br/></p>
<p><em>As seguintes fontes foram usadas para este artigo:</em></p>
<ul>
<li>"Desacoplamento de árvores de código-fonte em componentes de nível de compilação"</li>
<li>"<a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">Fatores a serem considerados ao adicionar dependências de terceiros a um projeto</a>"</li>
<li>"<a href="https://queue.acm.org/detail.cfm?id=3344149">Sobrevivendo às Dependências de Software</a>"</li>
<li>"<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Understanding Dependencies: Um estudo sobre os desafios de coordenação no desenvolvimento de software</a>"</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">Sobre o autor</h3><p>Zhifeng Zhang é um engenheiro DevOps sénior na Zilliz.com que trabalha no Milvus, uma base de dados vetorial de código aberto, e instrutor autorizado da universidade de software de código aberto LF na China. Ele recebeu seu diploma de bacharel em Internet das Coisas (IOT) do Instituto de Engenharia de Software de Guangzhou. Ele passa sua carreira participando e liderando projetos na área de CI/CD, DevOps, gerenciamento de infraestrutura de TI, kit de ferramentas Cloud-Native, conteinerização e otimização de processos de compilação.</p>
