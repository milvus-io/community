---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus in IP Protection：Construção de um sistema de pesquisa de semelhança de
  marcas registadas com Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: >-
  Saiba como aplicar a pesquisa de semelhança de vectores na indústria da
  proteção da PI.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>Nos últimos anos, a questão da proteção da propriedade intelectual tem estado sob as luzes da ribalta, uma vez que as pessoas estão cada vez mais conscientes da violação da propriedade intelectual. Em especial, a gigante multinacional da tecnologia Apple Inc. tem intentado ativamente <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">acções judiciais contra várias empresas por violação de propriedade intelectual</a>, incluindo violação de marcas registadas, patentes e desenhos. Para além dos casos mais notórios, a Apple Inc. também <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">contestou um pedido de registo de marca da Woolworths Limited</a>, uma cadeia de supermercados australiana, por violação de marca registada em 2009.  A Apple. Inc. argumentou que o logótipo da marca australiana, um &quot;w&quot; estilizado, se assemelhava ao seu próprio logótipo de uma maçã. Por conseguinte, a Apple Inc. opôs-se à gama de produtos, incluindo dispositivos electrónicos, que a Woolworths pretendia vender com o logótipo. A história termina com a Woolworths a alterar o seu logótipo e a Apple a retirar a sua oposição.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Logótipo da Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>Logótipo da Apple Inc.png</span> </span></p>
<p>Com a crescente consciencialização da cultura de marca, as empresas estão mais atentas a quaisquer ameaças que possam prejudicar os seus direitos de propriedade intelectual (PI). A infração de PI inclui:</p>
<ul>
<li>Violação de direitos de autor</li>
<li>Infração de patentes</li>
<li>Infração de marca registada</li>
<li>Infração de design</li>
<li>Cybersquatting</li>
</ul>
<p>O litígio acima referido entre a Apple e a Woolworths prende-se sobretudo com a violação de marcas registadas, precisamente a semelhança entre as imagens das marcas registadas das duas entidades. Para não se tornar noutra Woolworths, uma pesquisa exaustiva de semelhança de marcas é um passo crucial para os requerentes, tanto antes do depósito como durante a análise dos pedidos de registo de marcas. O recurso mais comum é através de uma pesquisa na <a href="https://tmsearch.uspto.gov/search/search-information">base de dados do Instituto de Patentes e Marcas dos Estados Unidos (USPTO)</a>, que contém todos os registos e pedidos de marca activos e inactivos. Apesar da interface de utilizador não tão encantadora, este processo de pesquisa também é profundamente imperfeito devido à sua natureza baseada em texto, uma vez que se baseia em palavras e códigos de design de marca registada (que são etiquetas anotadas à mão de caraterísticas de design) para procurar imagens.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Assim, este artigo pretende mostrar como construir um sistema eficiente de pesquisa de semelhança de marcas registadas com base em imagens utilizando <a href="https://milvus.io">o Milvus</a>, uma base de dados vetorial de código aberto.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">Um sistema de pesquisa de semelhanças vectoriais para marcas registadas<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Para criar um sistema de pesquisa de semelhanças vectoriais para marcas registadas, é necessário seguir os seguintes passos:</p>
<ol>
<li>Preparar um conjunto de dados massivo de logótipos. Provavelmente, o sistema pode utilizar um conjunto de dados como <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">este</a>,).</li>
<li>Treinar um modelo de extração de caraterísticas de imagem utilizando o conjunto de dados e modelos baseados em dados ou algoritmos de IA.</li>
<li>Converter os logótipos em vectores utilizando o modelo ou algoritmo treinado na etapa 2.</li>
<li>Armazenar os vectores e realizar pesquisas de semelhança de vectores em Milvus, a base de dados de vectores de código aberto.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>Nas secções seguintes, vamos analisar mais detalhadamente os dois principais passos na construção de um sistema de pesquisa de semelhanças vectoriais para marcas comerciais: utilizar modelos de IA para extração de caraterísticas de imagem e utilizar o Milvus para pesquisa de semelhanças vectoriais. No nosso caso, utilizámos o VGG16, uma rede neural convolucional (CNN), para extrair caraterísticas de imagem e convertê-las em vectores de incorporação.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Utilização do VGG16 para extração de caraterísticas de imagem</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">O VGG16</a> é uma CNN concebida para o reconhecimento de imagens em grande escala. O modelo é rápido e preciso no reconhecimento de imagens e pode ser aplicado a imagens de todos os tamanhos. Seguem-se duas ilustrações da arquitetura do VGG16.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>O modelo VGG16, como o próprio nome sugere, é uma CNN com 16 camadas. Todos os modelos VGG, incluindo o VGG16 e o VGG19, contêm 5 blocos VGG, com uma ou mais camadas convolucionais em cada bloco VGG. E no final de cada bloco, uma camada de pooling máximo é conectada para reduzir o tamanho da imagem de entrada. O número de kernels é equivalente em cada camada convolucional, mas duplica em cada bloco VGG. Por conseguinte, o número de kernels no modelo aumenta de 64 no primeiro bloco para 512 no quarto e quinto blocos. Todos os núcleos convolucionais têm<em>tamanho 33, enquanto os núcleos de agrupamento têm todos tamanho 22</em>. Isto permite preservar mais informações sobre a imagem de entrada.</p>
<p>Por conseguinte, neste caso, o VGG16 é um modelo adequado para o reconhecimento de imagens de conjuntos de dados maciços. Pode utilizar Python, Tensorflow e Keras para treinar um modelo de extração de caraterísticas de imagem com base no VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Utilização do Milvus para pesquisa de semelhanças vectoriais</h3><p>Depois de utilizar o modelo VGG16 para extrair caraterísticas de imagem e converter imagens de logótipos em vectores de incorporação, é necessário procurar vectores semelhantes a partir de um conjunto de dados maciço.</p>
<p>O Milvus é uma base de dados nativa da nuvem com elevada escalabilidade e elasticidade. Além disso, como base de dados, pode garantir a consistência dos dados. Para um sistema de pesquisa de semelhanças de marcas comerciais como este, novos dados, como os registos mais recentes de marcas comerciais, são carregados no sistema em tempo real. E estes dados recentemente carregados têm de estar imediatamente disponíveis para pesquisa. Por conseguinte, este artigo adopta a Milvus, a base de dados vetorial de código aberto, para efetuar a pesquisa de semelhanças vectoriais.</p>
<p>Ao inserir os vectores de logótipos, pode criar colecções no Milvus para diferentes tipos de vectores de logótipos de acordo com a <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">Classificação Internacional de Produtos e Serviços (Nice)</a>, um sistema de classificação de produtos e serviços para registo de marcas. Por exemplo, pode inserir um grupo de vectores de logótipos de marcas de vestuário numa coleção denominada &quot;vestuário&quot; no Milvus e inserir outro grupo de vectores de logótipos de marcas tecnológicas numa coleção diferente denominada &quot;tecnologia&quot;. Deste modo, pode aumentar consideravelmente a eficiência e a velocidade da sua pesquisa de semelhança de vectores.</p>
<p>O Milvus não só suporta múltiplos índices para a pesquisa por semelhança de vectores, como também fornece APIs e ferramentas avançadas para facilitar o DevOps. O diagrama seguinte ilustra a <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">arquitetura do Milvus</a>. Pode saber mais sobre o Milvus lendo <a href="https://milvus.io/docs/v2.0.x/overview.md">a</a> sua <a href="https://milvus.io/docs/v2.0.x/overview.md">introdução</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Procurando por mais recursos?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Crie mais sistemas de pesquisa de semelhanças vectoriais para outros cenários de aplicação com o Milvus:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Classificação de sequências de DNA baseada em Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recuperação de áudio com base em Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 passos para criar um sistema de pesquisa de vídeo</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Construindo um sistema de QA inteligente com NLP e Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Acelerar a descoberta de novos medicamentos</a></li>
</ul></li>
<li><p>Envolva-se com a nossa comunidade de código aberto:</p>
<ul>
<li>Encontre ou contribua para o Milvus no <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://bit.ly/3qiyTEk">Fórum</a>.</li>
<li>Ligue-se a nós no <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
