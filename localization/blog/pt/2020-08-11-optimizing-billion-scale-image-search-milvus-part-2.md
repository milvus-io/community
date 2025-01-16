---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: O sistema de pesquisa por imagem de segunda geração
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  Um caso de utilização do Milvus para criar um sistema de pesquisa por
  semelhança de imagens para empresas do mundo real.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>A viagem para otimizar a pesquisa de imagens à escala de milhares de milhões (2/2)</custom-h1><p>Este artigo é a segunda parte de <strong>A jornada para otimizar a pesquisa de imagens em escala de bilhões por UPYUN</strong>. Se não viu a primeira, clique <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">aqui</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">O sistema de pesquisa por imagem de segunda geração<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>O sistema de pesquisa por imagem de segunda geração escolhe tecnicamente a solução CNN + Milvus. O sistema baseia-se em vectores de caraterísticas e oferece um melhor apoio técnico.</p>
<h2 id="Feature-extraction" class="common-anchor-header">Extração de caraterísticas<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>No domínio da visão por computador, a utilização da inteligência artificial tornou-se a corrente principal. Do mesmo modo, a extração de elementos do sistema de pesquisa por imagem de segunda geração utiliza a rede neural convolucional (CNN) como tecnologia subjacente</p>
<p>O termo CNN é difícil de compreender. Aqui concentramo-nos em responder a duas perguntas:</p>
<ul>
<li>O que é que a CNN pode fazer?</li>
<li>Porque é que posso utilizar a CNN para uma pesquisa de imagens?</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>Existem muitos concursos no domínio da IA e a classificação de imagens é um dos mais importantes. A tarefa da classificação de imagens consiste em determinar se o conteúdo da imagem é sobre um gato, um cão, uma maçã, uma pera ou outros tipos de objectos.</p>
<p>O que é que a CNN pode fazer? Pode extrair caraterísticas e reconhecer objectos. Extrai caraterísticas de várias dimensões e mede a proximidade entre as caraterísticas de uma imagem e as caraterísticas de gatos ou cães. Podemos escolher as mais próximas como resultado da identificação, o que indica se o conteúdo de uma imagem específica é sobre um gato, um cão ou outra coisa qualquer.</p>
<p>Qual é a relação entre a função de identificação de objectos da CNN e a pesquisa por imagem? O que pretendemos não é o resultado final da identificação, mas o vetor de caraterísticas extraído de múltiplas dimensões. Os vectores de caraterísticas de duas imagens com conteúdo semelhante devem ser próximos.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">Que modelo de CNN devo utilizar?</h3><p>A resposta é VGG16. Porquê escolhê-lo? Em primeiro lugar, o VGG16 tem uma boa capacidade de generalização, ou seja, é muito versátil. Em segundo lugar, os vectores de caraterísticas extraídos pelo VGG16 têm 512 dimensões. Se houver muito poucas dimensões, a precisão pode ser afetada. Se houver demasiadas dimensões, o custo de armazenar e calcular estes vectores de caraterísticas é relativamente elevado.</p>
<p>A utilização de CNN para extrair caraterísticas de imagem é uma solução comum. Podemos utilizar o VGG16 como modelo e o Keras + TensorFlow para a implementação técnica. Eis o exemplo oficial do Keras:</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>As caraterísticas extraídas aqui são vectores de caraterísticas.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. Normalização</h3><p>Para facilitar as operações subsequentes, é frequente normalizarmos as caraterísticas:</p>
<p>O que é usado posteriormente é também o normalizado <code translate="no">norm_feat</code>.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. Descrição da imagem</h3><p>A imagem é carregada utilizando o método <code translate="no">image.load_img</code> de <code translate="no">keras.preprocessing</code>:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>De facto, é o método TensorFlow chamado pelo Keras. Para mais pormenores, consulte a documentação do TensorFlow. O objeto de imagem final é, na realidade, uma instância de imagem PIL (o PIL utilizado pelo TensorFlow).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. Conversão de bytes</h3><p>Em termos práticos, o conteúdo da imagem é frequentemente transmitido através da rede. Por isso, em vez de carregar imagens a partir do caminho, preferimos converter dados de bytes diretamente em objectos de imagem, ou seja, Imagens PIL:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>A imagem acima é igual ao resultado obtido pelo método image.load_img. Há duas coisas a ter em atenção:</p>
<ul>
<li>É preciso fazer a conversão RGB.</li>
<li>É preciso redimensionar (resize é o segundo parâmetro do <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. Processamento do contorno preto</h3><p>As imagens, como as capturas de ecrã, podem ocasionalmente ter alguns contornos pretos. Estas margens negras não têm qualquer valor prático e causam muita interferência. Por este motivo, a remoção dos limites pretos é também uma prática comum.</p>
<p>Um contorno preto é essencialmente uma linha ou coluna de pixéis onde todos os pixéis são (0, 0, 0) (imagem RGB). Para remover o contorno preto, é necessário encontrar essas linhas ou colunas e eliminá-las. Isto é, de facto, uma multiplicação de matriz 3-D em NumPy.</p>
<p>Um exemplo de remoção de margens pretas horizontais:</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>Isto é basicamente o que eu quero falar sobre a utilização da CNN para extrair caraterísticas de imagens e implementar outro processamento de imagens. Agora vamos dar uma vista de olhos aos motores de pesquisa vectoriais.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">Motor de pesquisa vetorial<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>O problema da extração de vectores de caraterísticas das imagens foi resolvido. Os restantes problemas são:</p>
<ul>
<li>Como armazenar vectores de caraterísticas?</li>
<li>Como calcular a semelhança dos vectores de caraterísticas, ou seja, como pesquisar? O motor de pesquisa vetorial de código aberto Milvus pode resolver estes dois problemas. Até agora, tem estado a funcionar bem no nosso ambiente de produção.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">Milvus, o motor de pesquisa vetorial<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Extrair vectores de caraterísticas de uma imagem está longe de ser suficiente. Também precisamos de gerir dinamicamente estes vectores de caraterísticas (adição, eliminação e atualização), calcular a semelhança dos vectores e devolver os dados dos vectores no intervalo de vizinhança mais próximo. O motor de pesquisa de vectores de código aberto Milvus executa estas tarefas bastante bem.</p>
<p>O resto deste artigo descreverá práticas específicas e pontos a ter em conta.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. Requisitos para a CPU</h3><p>Para utilizar o Milvus, o seu CPU tem de suportar o conjunto de instruções avx2. Para sistemas Linux, use o seguinte comando para verificar quais conjuntos de instruções sua CPU suporta:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>Então obterá algo como:</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>O que se segue às flags são os conjuntos de instruções que o seu CPU suporta. É claro que isso é muito mais do que eu preciso. Eu só quero ver se um conjunto de instruções específico, como avx2, é suportado. Basta adicionar um grep para filtrá-lo:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>Se nenhum resultado for obtido, significa que esse conjunto de instruções específico não é suportado. Nesse caso, é preciso mudar de máquina.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. Planeamento da capacidade</h3><p>O planeamento da capacidade é a nossa primeira consideração quando concebemos um sistema. Qual a quantidade de dados que precisamos de armazenar? Qual a quantidade de memória e espaço em disco que os dados requerem?</p>
<p>Vamos fazer algumas contas rápidas. Cada dimensão de um vetor é float32. Um tipo float32 ocupa 4 Bytes. Assim, um vetor de 512 dimensões requer 2 KB de armazenamento. Da mesma forma:</p>
<ul>
<li>Mil vectores de 512 dimensões requerem 2 MB de armazenamento.</li>
<li>Um milhão de vectores de 512 dimensões requerem 2 GB de armazenamento.</li>
<li>10 milhões de vectores de 512 dimensões requerem 20 GB de armazenamento.</li>
<li>100 milhões de vectores de 512 dimensões requerem 200 GB de armazenamento.</li>
<li>Mil milhões de vectores de 512 dimensões requerem 2 TB de armazenamento.</li>
</ul>
<p>Se quisermos armazenar todos os dados na memória, o sistema precisa de ter, pelo menos, a capacidade de memória correspondente.</p>
<p>Recomenda-se a utilização da ferramenta oficial de cálculo de tamanho: Milvus sizing tool.</p>
<p>Na verdade, a nossa memória pode não ser assim tão grande (se não tivermos memória suficiente, não faz mal). O Milvus descarrega automaticamente os dados para o disco). Para além dos dados vectoriais originais, temos também de considerar o armazenamento de outros dados, como os registos.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. Configuração do sistema</h3><p>Para mais informações sobre a configuração do sistema, consulte a documentação do Milvus:</p>
<ul>
<li>Configuração do servidor Milvus: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. Desenho da base de dados</h3><p><strong>Coleção e partição</strong></p>
<ul>
<li>A coleção é também conhecida como tabela.</li>
<li>A partição refere-se às partições dentro de uma coleção.</li>
</ul>
<p>A implementação subjacente da partição é, na verdade, a mesma que a da coleção, exceto que uma partição está sob uma coleção. Mas com as partições, a organização dos dados torna-se mais flexível. Também podemos consultar uma partição específica numa coleção para obter melhores resultados de consulta.</p>
<p>Quantas colecções e partições podemos ter? A informação básica sobre colecções e partições encontra-se em Metadata. O Milvus utiliza o SQLite (integração interna do Milvus) ou o MySQL (requer uma ligação externa) para a gestão interna dos metadados. Se utilizar o SQLite por defeito para gerir os metadados, sofrerá uma grave perda de desempenho quando o número de colecções e partições for demasiado grande. Por conseguinte, o número total de colecções e partições não deve exceder 50 000 (o Milvus 0.8.0 limitará este número a 4 096). Se precisar de definir um número maior, recomenda-se que utilize o MySQL através de uma ligação externa.</p>
<p>A estrutura de dados suportada pela coleção e partição do Milvus é muito simples, ou seja, <code translate="no">ID + vector</code>. Por outras palavras, existem apenas duas colunas na tabela: ID e dados do vetor.</p>
<p><strong>Nota:</strong></p>
<ul>
<li>O ID deve ser um número inteiro.</li>
<li>Temos de garantir que o ID é único dentro de uma coleção em vez de dentro de uma partição.</li>
</ul>
<p><strong>Filtragem condicional</strong></p>
<p>Quando utilizamos bases de dados tradicionais, podemos especificar valores de campo como condições de filtragem. Embora o Milvus não filtre exatamente da mesma forma, podemos implementar uma filtragem condicional simples utilizando colecções e partições. Por exemplo, temos uma grande quantidade de dados de imagens e os dados pertencem a utilizadores específicos. Então, podemos dividir os dados em partições por utilizador. Assim, utilizar o utilizador como condição de filtragem é, na realidade, especificar a partição.</p>
<p><strong>Dados estruturados e mapeamento vetorial</strong></p>
<p>O Milvus apenas suporta a estrutura de dados ID + vetor. Mas em cenários empresariais, o que precisamos é de dados estruturados com significado empresarial. Por outras palavras, precisamos de encontrar dados estruturados através de vectores. Por conseguinte, é necessário manter as relações de mapeamento entre os dados estruturados e os vectores através do ID.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>Seleção do índice</strong></p>
<p>Pode consultar os seguintes artigos:</p>
<ul>
<li>Tipos de índices: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>Como selecionar um índice: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. Processamento dos resultados da pesquisa</h3><p>Os resultados de pesquisa do Milvus são uma coleção de ID + distância:</p>
<ul>
<li>ID: o ID numa coleção.</li>
<li>Distância: um valor de distância de 0 ~ 1 indica o nível de semelhança; quanto menor for o valor, mais semelhantes são os dois vectores.</li>
</ul>
<p><strong>Filtragem de dados cujo ID é -1</strong></p>
<p>Quando o número de colecções é demasiado pequeno, os resultados da pesquisa podem conter dados cujo ID é -1. Temos de os filtrar por nós próprios.</p>
<p><strong>Paginação</strong></p>
<p>A pesquisa de vectores é bastante diferente. Os resultados da consulta são ordenados por ordem decrescente de semelhança e os resultados mais semelhantes (topK) são selecionados (topK é especificado pelo utilizador no momento da consulta).</p>
<p>O Milvus não suporta a paginação. Temos de implementar a função de paginação por nós próprios se precisarmos dela para fins comerciais. Por exemplo, se tivermos dez resultados em cada página e só quisermos mostrar a terceira página, temos de especificar que topK = 30 e devolver apenas os últimos dez resultados.</p>
<p><strong>Limiar de semelhança para negócios</strong></p>
<p>A distância entre os vectores de duas imagens situa-se entre 0 e 1. Se quisermos decidir se duas imagens são semelhantes num cenário comercial específico, temos de especificar um limiar dentro deste intervalo. As duas imagens são semelhantes se a distância for inferior ao limiar, ou são bastante diferentes uma da outra se a distância for superior ao limiar. É necessário ajustar o limiar de acordo com as necessidades da sua empresa.</p>
<blockquote>
<p>Este artigo foi escrito por rifewang, utilizador de Milvus e engenheiro de software da UPYUN. Se gostou deste artigo, venha dizer olá @ https://github.com/rifewang.</p>
</blockquote>
