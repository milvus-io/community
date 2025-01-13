---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: Descrição geral
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  Um estudo de caso com a UPYUN. Saiba como o Milvus se distingue das soluções
  tradicionais de bases de dados e ajuda a criar um sistema de pesquisa por
  semelhança de imagens.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>A jornada para otimizar a pesquisa de imagens à escala de milhares de milhões (1/2)</custom-h1><p>O Yupoo Picture Manager serve dezenas de milhões de utilizadores e gere dezenas de milhares de milhões de imagens. Como a sua galeria de utilizadores está a aumentar, a Yupoo tem uma necessidade comercial urgente de uma solução que possa localizar rapidamente a imagem. Por outras palavras, quando um utilizador introduz uma imagem, o sistema deve encontrar a sua imagem original e imagens semelhantes na galeria. O desenvolvimento do serviço de pesquisa por imagem constitui uma abordagem eficaz a este problema.</p>
<p>O serviço de pesquisa por imagem passou por duas evoluções:</p>
<ol>
<li>Começou a primeira investigação técnica no início de 2019 e lançou o sistema de primeira geração em março e abril de 2019;</li>
<li>Começou a investigação do plano de atualização no início de 2020 e iniciou a atualização geral para o sistema de segunda geração em abril de 2020.</li>
</ol>
<p>O presente artigo descreve a seleção de tecnologias e os princípios básicos subjacentes às duas gerações de sistemas de pesquisa por imagem, com base na minha própria experiência neste projeto.</p>
<h2 id="Overview" class="common-anchor-header">Descrição geral<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">O que é uma imagem?</h3><p>Antes de falarmos de imagens, temos de saber o que é uma imagem.</p>
<p>A resposta é que uma imagem é um conjunto de pixéis.</p>
<p>Por exemplo, a parte da caixa vermelha nesta imagem é praticamente uma série de pixéis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-o-que-é-uma-imagem.png</span> </span></p>
<p>Suponhamos que a parte na caixa vermelha é uma imagem, então cada pequeno quadrado independente na imagem é um pixel, a unidade básica de informação. Então, o tamanho da imagem é 11 x 11 px.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-o-que-é-uma-imagem.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">Representação matemática de imagens</h3><p>Cada imagem pode ser representada por uma matriz. Cada pixel da imagem corresponde a um elemento da matriz.</p>
<h3 id="Binary-images" class="common-anchor-header">Imagens binárias</h3><p>Os pixéis de uma imagem binária são pretos ou brancos, pelo que cada pixel pode ser representado por 0 ou 1. Por exemplo, a representação matricial de uma imagem binária 4 * 4 é:</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">Imagens RGB</h3><p>As três cores primárias (vermelho, verde e azul) podem ser misturadas para produzir qualquer cor. Para imagens RGB, cada pixel tem a informação básica de três canais RGB. Da mesma forma, se cada canal utilizar um número de 8 bits (em 256 níveis) para representar a sua escala de cinzentos, então a representação matemática de um pixel é:</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>Tomando uma imagem 4 * 4 RGB como exemplo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>A essência do processamento de imagens consiste em processar estas matrizes de pixéis.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">O problema técnico da pesquisa por imagem<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>Se estiver à procura da imagem original, ou seja, uma imagem com exatamente os mesmos pixels, pode comparar diretamente os seus valores MD5. No entanto, as imagens carregadas na Internet são frequentemente comprimidas ou têm marcas de água. Mesmo uma pequena alteração numa imagem pode criar um resultado MD5 diferente. Enquanto houver inconsistência nos pixéis, é impossível encontrar a imagem original.</p>
<p>Para um sistema de pesquisa por imagem, queremos procurar imagens com conteúdo semelhante. Então, precisamos de resolver dois problemas básicos:</p>
<ul>
<li>Representar ou abstrair uma imagem como um formato de dados que pode ser processado por um computador.</li>
<li>Os dados devem ser comparáveis para efeitos de cálculo.</li>
</ul>
<p>Mais especificamente, precisamos das seguintes caraterísticas:</p>
<ul>
<li>Extração de caraterísticas da imagem.</li>
<li>Cálculo das caraterísticas (cálculo da semelhança).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">O sistema de pesquisa por imagem de primeira geração<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">Extração de caraterísticas - abstração de imagens</h3><p>O sistema de pesquisa por imagem de primeira geração utiliza o algoritmo Percetual hash ou pHash para a extração de caraterísticas. Quais são os princípios básicos deste algoritmo?</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-primeira-geração-pesquisa-de-imagem.png</span> </span></p>
<p>Como mostra a figura acima, o algoritmo pHash efectua uma série de transformações na imagem para obter o valor de hash. Durante o processo de transformação, o algoritmo abstrai continuamente as imagens, aproximando assim os resultados de imagens semelhantes.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">Cálculo de caraterísticas - cálculo de semelhança</h3><p>Como calcular a semelhança entre os valores pHash de duas imagens? A resposta é utilizar a distância de Hamming. Quanto mais pequena for a distância de Hamming, mais semelhante é o conteúdo das imagens.</p>
<p>O que é a distância de Hamming? É o número de bits diferentes.</p>
<p>Por exemplo,</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>Existem dois bits diferentes nos dois valores acima, pelo que a distância de Hamming entre eles é 2.</p>
<p>Agora já sabemos o princípio do cálculo da semelhança. A questão seguinte é: como calcular as distâncias de Hamming de dados à escala de 100 milhões de imagens à escala de 100 milhões de imagens? Em suma, como procurar imagens semelhantes?</p>
<p>Na fase inicial do projeto, não encontrei uma ferramenta satisfatória (ou um motor de computação) que pudesse calcular rapidamente a distância de Hamming. Por isso, alterei o meu plano.</p>
<p>A minha ideia é que, se a distância de Hamming entre dois valores de pHash for pequena, então posso cortar os valores de pHash e as partes pequenas correspondentes serão provavelmente iguais.</p>
<p>Por exemplo:</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>Dividimos os dois valores acima em oito segmentos e os valores de seis segmentos são exatamente os mesmos. Pode deduzir-se que a sua distância de Hamming é próxima e, por isso, estas duas imagens são semelhantes.</p>
<p>Após a transformação, pode constatar que o problema do cálculo da distância de Hamming se tornou num problema de equivalência de correspondência. Se eu dividir cada valor de pHash em oito segmentos, desde que haja mais de cinco segmentos que tenham exatamente os mesmos valores, então os dois valores de pHash são semelhantes.</p>
<p>Assim, é muito simples resolver a correspondência de equivalência. Podemos utilizar a filtragem clássica de um sistema de base de dados tradicional.</p>
<p>Naturalmente, utilizo a correspondência de vários termos e especifico o grau de correspondência utilizando minimum_should_match no ElasticSearch (este artigo não introduz o princípio do ES, pode aprendê-lo por si próprio).</p>
<p>Porque é que escolhemos o ElasticSearch? Em primeiro lugar, porque fornece a função de pesquisa acima referida. Em segundo lugar, o próprio projeto de gestão de imagens utiliza o ES para fornecer uma função de pesquisa de texto integral e é muito económico utilizar os recursos existentes.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">Resumo do sistema de primeira geração<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>O sistema de pesquisa por imagem de primeira geração escolhe a solução pHash + ElasticSearch, que tem as seguintes caraterísticas</p>
<ul>
<li>O algoritmo pHash é simples de utilizar e pode resistir a um certo grau de compressão, marca de água e ruído.</li>
<li>O ElasticSearch utiliza os recursos existentes do projeto sem acrescentar custos adicionais à pesquisa.</li>
<li>Mas a limitação deste sistema é óbvia: o algoritmo pHash é uma representação abstrata de toda a imagem. Se destruirmos a integridade da imagem, como adicionar um contorno preto à imagem original, é quase impossível avaliar a semelhança entre a imagem original e as outras.</li>
</ul>
<p>Para ultrapassar estas limitações, surgiu o sistema de pesquisa de imagens de segunda geração com uma tecnologia subjacente completamente diferente.</p>
<p>Este artigo foi escrito por rifewang, utilizador de Milvus e engenheiro de software da UPYUN. Se gostou deste artigo, venha dizer olá! https://github.com/rifewang</p>
