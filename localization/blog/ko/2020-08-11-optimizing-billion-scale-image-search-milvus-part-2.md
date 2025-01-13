---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: 2세대 이미지 기반 검색 시스템
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: 실제 비즈니스를 위한 이미지 유사도 검색 시스템을 구축하기 위해 Milvus를 활용한 사용자 사례입니다.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>수십억 규모의 이미지 검색 최적화를 위한 여정 (2/2)</custom-h1><p>이 글은 <strong>10억 건 규모의 이미지 검색 최적화를 위한 여정의</strong> 두 번째 이야기입니다. 1편을 놓치셨다면 <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">여기를</a> 클릭하세요.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">2세대 이미지 기반 검색 시스템<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>2세대 이미지 기반 검색 시스템은 기술적으로 CNN + Milvus 솔루션을 채택하고 있습니다. 이 시스템은 특징 벡터를 기반으로 하며 더 나은 기술 지원을 제공합니다.</p>
<h2 id="Feature-extraction" class="common-anchor-header">특징 추출<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>컴퓨터 비전 분야에서는 인공 지능의 사용이 대세가 되었습니다. 마찬가지로 2세대 이미지 기반 검색 시스템의 특징 추출은 컨볼루션 신경망(CNN)을 기본 기술로 사용합니다.</p>
<p>CNN이라는 용어는 이해하기 어렵습니다. 여기서는 두 가지 질문에 답하는 데 중점을 둡니다:</p>
<ul>
<li>CNN은 무엇을 할 수 있나요?</li>
<li>이미지 검색에 CNN을 사용할 수 있는 이유는 무엇인가요?</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>AI 분야에는 많은 경연 대회가 있으며 이미지 분류는 가장 중요한 분야 중 하나입니다. 이미지 분류는 사진의 내용이 고양이, 개, 사과, 배 또는 다른 유형의 사물에 관한 것인지 판단하는 작업입니다.</p>
<p>CNN은 무엇을 할 수 있나요? 특징을 추출하고 물체를 인식할 수 있습니다. 여러 차원에서 특징을 추출하고 이미지의 특징이 고양이 또는 강아지의 특징에 얼마나 가까운지 측정합니다. 가장 가까운 것을 식별 결과로 선택하여 특정 이미지의 콘텐츠가 고양이에 관한 것인지, 개에 관한 것인지, 아니면 다른 것인지를 나타냅니다.</p>
<p>CNN의 객체 식별 기능과 이미지별 검색은 어떤 관련이 있나요? 우리가 원하는 것은 최종 식별 결과가 아니라 다차원에서 추출한 특징 벡터입니다. 콘텐츠가 비슷한 두 이미지의 특징 벡터가 비슷해야 합니다.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">어떤 CNN 모델을 사용해야 하나요?</h3><p>정답은 VGG16입니다. 왜 이 모델을 선택해야 할까요? 첫째, VGG16은 일반화 기능이 우수하여 매우 다재다능합니다. 둘째, VGG16에서 추출한 특징 벡터는 512개의 차원을 가지고 있습니다. 차원이 매우 적으면 정확도에 영향을 미칠 수 있습니다. 차원이 너무 많으면 이러한 특징 벡터를 저장하고 계산하는 데 드는 비용이 상대적으로 높습니다.</p>
<p>CNN을 사용하여 이미지 특징을 추출하는 것이 주류 솔루션입니다. 모델로는 VGG16을 사용하고 기술 구현에는 Keras + TensorFlow를 사용할 수 있습니다. 다음은 Keras의 공식 예제입니다:</p>
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
<p>여기서 추출된 특징은 특징 벡터입니다.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. 정규화</h3><p>후속 작업을 용이하게 하기 위해 종종 특징을 정규화합니다:</p>
<p>이후에 사용되는 것도 정규화된 <code translate="no">norm_feat</code> 입니다.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. 이미지 설명</h3><p><code translate="no">keras.preprocessing</code> 의 <code translate="no">image.load_img</code> 메서드를 사용하여 이미지를 로드합니다:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>사실 이 메서드는 Keras에서 호출하는 TensorFlow 메서드입니다. 자세한 내용은 텐서플로우 설명서를 참조하세요. 최종 이미지 객체는 실제로 PIL 이미지 인스턴스(TensorFlow에서 사용하는 PIL)입니다.</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. 바이트 변환</h3><p>실제로 이미지 콘텐츠는 네트워크를 통해 전송되는 경우가 많습니다. 따라서 경로에서 이미지를 로드하는 대신 바이트 데이터를 이미지 객체, 즉 PIL 이미지로 직접 변환하는 것을 선호합니다:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>위의 이미지는 image.load_img 메서드로 얻은 결과와 동일합니다. 주의해야 할 두 가지 사항이 있습니다:</p>
<ul>
<li>RGB 변환을 수행해야 합니다.</li>
<li>크기를 조정해야 합니다(크기 조정은 <code translate="no">load_img method</code>)의 두 번째 매개 변수입니다.</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. 검은색 테두리 처리</h3><p>스크린샷과 같은 이미지에는 때때로 검은색 테두리가 상당히 많이 있을 수 있습니다. 이러한 검은색 테두리는 실질적인 가치가 없으며 많은 간섭을 유발합니다. 이러한 이유로 검은색 테두리를 제거하는 것이 일반적인 관행입니다.</p>
<p>검은색 테두리는 기본적으로 모든 픽셀이 (0, 0, 0)인 픽셀의 행 또는 열입니다(RGB 이미지). 검은색 테두리를 제거하려면 이러한 행이나 열을 찾아서 삭제하면 됩니다. 이것은 실제로 NumPy에서 3D 행렬 곱셈입니다.</p>
<p>가로 검은색 테두리를 제거하는 예제입니다:</p>
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
<p>이것이 바로 CNN을 사용하여 이미지 특징을 추출하고 다른 이미지 처리를 구현하는 방법에 대해 이야기하고자 하는 내용입니다. 이제 벡터 검색 엔진에 대해 살펴보겠습니다.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">벡터 검색 엔진<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>이미지에서 특징 벡터를 추출하는 문제는 해결되었습니다. 이제 남은 문제는</p>
<ul>
<li>특징 벡터를 저장하는 방법은 무엇인가요?</li>
<li>특징 벡터의 유사도를 계산하는 방법, 즉 검색 방법은 무엇일까요? 오픈 소스 벡터 검색 엔진 Milvus는 이 두 가지 문제를 해결할 수 있습니다. 지금까지 저희 프로덕션 환경에서 잘 작동하고 있습니다.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">밀버스, 벡터 검색 엔진<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>이미지에서 특징 벡터를 추출하는 것만으로는 충분하지 않습니다. 이러한 특징 벡터를 동적으로 관리(추가, 삭제, 업데이트)하고, 벡터의 유사도를 계산하여 가장 가까운 이웃 범위의 벡터 데이터를 반환해야 합니다. 오픈 소스 벡터 검색 엔진인 Milvus는 이러한 작업을 매우 잘 수행합니다.</p>
<p>이 글의 나머지 부분에서는 구체적인 사용 방법과 주의해야 할 점에 대해 설명합니다.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. CPU 요구 사항</h3><p>Milvus를 사용하려면 CPU가 avx2 명령어 집합을 지원해야 합니다. Linux 시스템의 경우 다음 명령을 사용하여 CPU가 지원하는 명령어 집합을 확인하세요:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>그러면 다음과 같은 결과가 나옵니다:</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>플래그 다음에 나오는 것은 CPU가 지원하는 명령어 세트입니다. 물론 이것들은 제가 필요로 하는 것보다 훨씬 더 많습니다. 저는 단지 avx2와 같은 특정 명령어 집합이 지원되는지 확인하고 싶을 뿐입니다. 필터링하려면 grep을 추가하면 됩니다:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>결과가 반환되지 않으면 이 특정 명령어 집합이 지원되지 않는다는 뜻입니다. 그렇다면 기기를 변경해야 합니다.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. 용량 계획</h3><p>용량 계획은 시스템을 설계할 때 가장 먼저 고려해야 할 사항입니다. 얼마나 많은 데이터를 저장해야 할까요? 데이터에 얼마나 많은 메모리와 디스크 공간이 필요할까요?</p>
<p>간단한 계산을 해보겠습니다. 벡터의 각 차원은 float32입니다. float32 유형은 4바이트를 차지합니다. 그렇다면 512차원의 벡터에는 2KB의 저장 공간이 필요합니다. 같은 맥락에서:</p>
<ul>
<li>512차원 벡터 1,000개에는 2MB의 스토리지가 필요합니다.</li>
<li>백만 개의 512차원 벡터에는 2GB의 스토리지가 필요합니다.</li>
<li>512차원 벡터 천만 개에는 20GB의 스토리지가 필요합니다.</li>
<li>1억 개의 512차원 벡터에는 200GB의 스토리지가 필요합니다.</li>
<li>10억 개의 512차원 벡터에는 2TB의 스토리지가 필요합니다.</li>
</ul>
<p>모든 데이터를 메모리에 저장하려면 시스템에 최소한 해당 메모리 용량이 필요합니다.</p>
<p>공식 크기 계산 도구를 사용하는 것이 좋습니다: Milvus 크기 계산 도구.</p>
<p>사실 저희 메모리는 그렇게 크지 않을 수도 있습니다. (메모리가 충분하지 않더라도 상관없습니다. Milvus는 자동으로 데이터를 디스크에 플러시합니다.) 원본 벡터 데이터 외에도 로그와 같은 다른 데이터의 저장도 고려해야 합니다.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. 시스템 구성</h3><p>시스템 구성에 대한 자세한 내용은 Milvus 설명서를 참조하세요:</p>
<ul>
<li>Milvus 서버 구성: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. 데이터베이스 디자인</h3><p><strong>컬렉션 및 파티션</strong></p>
<ul>
<li>컬렉션은 테이블이라고도 합니다.</li>
<li>파티션은 컬렉션 내부의 파티션을 의미합니다.</li>
</ul>
<p>파티션의 기본 구현은 파티션이 컬렉션 아래에 있다는 점을 제외하면 컬렉션과 동일합니다. 하지만 파티션을 사용하면 데이터 구성이 더 유연해집니다. 또한 컬렉션의 특정 파티션을 쿼리하여 더 나은 쿼리 결과를 얻을 수 있습니다.</p>
<p>컬렉션과 파티션은 몇 개까지 만들 수 있나요? 컬렉션과 파티션에 대한 기본 정보는 메타데이터에 있습니다. Milvus는 내부 메타데이터 관리를 위해 SQLite(Milvus 내부 통합) 또는 MySQL(외부 연결 필요)을 사용합니다. 메타데이터 관리에 기본적으로 SQLite를 사용하면 컬렉션과 파티션의 수가 너무 많을 경우 심각한 성능 저하를 겪게 됩니다. 따라서 총 컬렉션 및 파티션 수는 50,000개를 초과하지 않아야 합니다(Milvus 0.8.0에서는 이 수를 4,096개로 제한합니다). 더 큰 숫자를 설정해야 하는 경우 외부 연결을 통해 MySQL을 사용하는 것이 좋습니다.</p>
<p>Milvus의 수집 및 파티션이 지원하는 데이터 구조는 <code translate="no">ID + vector</code> 로 매우 간단합니다. 즉, 테이블에는 두 개의 열만 있습니다: ID와 벡터 데이터입니다.</p>
<p><strong>참고:</strong></p>
<ul>
<li>ID는 정수여야 합니다.</li>
<li>ID가 파티션이 아닌 컬렉션 내에서 고유한지 확인해야 합니다.</li>
</ul>
<p><strong>조건부 필터링</strong></p>
<p>기존 데이터베이스를 사용할 때는 필드 값을 필터링 조건으로 지정할 수 있습니다. Milvus는 정확히 동일한 방식으로 필터링하지는 않지만 컬렉션과 파티션을 사용하여 간단한 조건부 필터링을 구현할 수 있습니다. 예를 들어 대량의 이미지 데이터가 있고 그 데이터가 특정 사용자에게 속한다고 가정해 보겠습니다. 그런 다음 데이터를 사용자별로 파티션으로 나눌 수 있습니다. 따라서 사용자를 필터 조건으로 사용하는 것은 사실상 파티션을 지정하는 것입니다.</p>
<p><strong>구조화된 데이터와 벡터 매핑</strong></p>
<p>Milvus는 ID + 벡터 데이터 구조만 지원합니다. 하지만 비즈니스 시나리오에서 우리에게 필요한 것은 비즈니스 의미를 지닌 구조화된 데이터입니다. 즉, 벡터를 통해 구조화된 데이터를 찾아야 합니다. 따라서 ID를 통해 구조화된 데이터와 벡터 간의 매핑 관계를 유지해야 합니다.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>인덱스 선택</strong></p>
<p>다음 문서를 참고할 수 있습니다:</p>
<ul>
<li>인덱스의 종류: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>인덱스 선택 방법: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. 검색 결과 처리</h3><p>밀버스의 검색 결과는 ID + 거리의 집합입니다:</p>
<ul>
<li>ID: 컬렉션의 ID입니다.</li>
<li>거리: 0~1의 거리 값은 유사도 수준을 나타내며, 값이 작을수록 두 벡터의 유사도가 높습니다.</li>
</ul>
<p><strong>ID가 -1인 데이터 필터링하기</strong></p>
<p>컬렉션의 수가 너무 적으면 검색 결과에 ID가 -1인 데이터가 포함될 수 있습니다. 이 경우 직접 필터링해야 합니다.</p>
<p><strong>페이지 매김</strong></p>
<p>벡터에 대한 검색은 상당히 다릅니다. 쿼리 결과는 유사도 내림차순으로 정렬되며, 가장 유사한 결과(상위 K)가 선택됩니다(상위 K는 쿼리 시 사용자가 지정합니다).</p>
<p>Milvus는 페이지 매김을 지원하지 않습니다. 업무상 페이지 매김 기능이 필요한 경우 직접 구현해야 합니다. 예를 들어, 각 페이지에 10개의 결과가 있고 세 번째 페이지만 표시하려는 경우 topK = 30으로 지정하고 마지막 10개의 결과만 반환해야 합니다.</p>
<p><strong>비즈니스용 유사성 임계값</strong></p>
<p>두 이미지의 벡터 사이의 거리는 0과 1 사이입니다. 특정 비즈니스 시나리오에서 두 이미지가 유사한지 여부를 결정하려면 이 범위 내에서 임계값을 지정해야 합니다. 거리가 임계값보다 작으면 두 이미지가 유사하고, 거리가 임계값보다 크면 서로 상당히 다른 이미지가 됩니다. 자신의 비즈니스 요구에 맞게 임계값을 조정해야 합니다.</p>
<blockquote>
<p>이 글은 Milvus 사용자이자 UPYUN의 소프트웨어 엔지니어인 rifewang이 작성했습니다. 이 글이 마음에 드신다면 https://github.com/rifewang.</p>
</blockquote>
