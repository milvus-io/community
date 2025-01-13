---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: 'IP 보호의 Milvus: Milvus로 상표 유사성 검색 시스템 구축하기'
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: IP 보호 업계에서 벡터 유사도 검색을 적용하는 방법을 알아보세요.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>최근 지식재산권 침해에 대한 사람들의 인식이 높아짐에 따라 지식재산권 보호 문제가 각광받고 있습니다. 특히 다국적 기술 대기업인 Apple은 상표권, 특허권, 디자인 침해 등 <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">다양한 기업을 상대로 IP 침해 소송을</a> 활발히 <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">제기하고</a> 있습니다. 가장 악명 높은 사례 외에도 Apple Inc.는 2009년 호주 슈퍼마켓 체인인 <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">울워스(Woolworths Limited)의 상표권 출원에</a> 대해 상표권 침해를 이유로 <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">이의를</a> 제기하기도 했습니다.  Apple. Inc는 호주 브랜드의 로고인 양식화된 &quot;w&quot;가 자사의 사과 로고와 유사하다고 주장했습니다. 따라서 Apple Inc는 울워스가 해당 로고로 판매하기 위해 신청한 전자 기기를 포함한 다양한 제품에 대해 이의를 제기했습니다. 이 이야기는 울워스가 로고를 수정하고 Apple이 반대를 철회하는 것으로 끝납니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>울워스 로고.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>애플 로고.png</span> </span></p>
<p>브랜드 문화에 대한 인식이 날로 높아짐에 따라 기업들은 지적 재산(IP) 권리를 해칠 수 있는 모든 위협을 면밀히 주시하고 있습니다. IP 침해에는 다음이 포함됩니다:</p>
<ul>
<li>저작권 침해</li>
<li>특허 침해</li>
<li>상표권 침해</li>
<li>디자인 침해</li>
<li>사이버 스쿼팅</li>
</ul>
<p>앞서 언급한 애플과 울워스 간의 분쟁은 주로 상표권 침해, 즉 두 기업의 상표 이미지가 유사하다는 점에 관한 것입니다. 또 다른 울워스가 되지 않으려면 상표 출원 전과 상표 출원 검토 과정에서 철저한 상표 유사성 검색이 신청자에게 매우 중요한 단계입니다. 가장 일반적인 방법은 활성 및 비활성 상표 등록 및 출원이 모두 포함된 <a href="https://tmsearch.uspto.gov/search/search-information">미국 특허청(USPTO) 데이터베이스에서</a> 검색하는 것입니다. 이 검색 프로세스는 그다지 매력적이지는 않지만, 이미지를 검색하기 위해 단어와 상표 디자인 코드(디자인 특징의 수작업 주석 레이블)에 의존하기 때문에 텍스트 기반이라는 점에서 심각한 결함이 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>따라서 이 글에서는 오픈 소스 벡터 데이터베이스인 <a href="https://milvus.io">Milvus를</a> 사용하여 효율적인 이미지 기반 상표 유사도 검색 시스템을 구축하는 방법을 소개하고자 합니다.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">상표를 위한 벡터 유사도 검색 시스템 구축하기<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>상표에 대한 벡터 유사도 검색 시스템을 구축하려면 다음 단계를 거쳐야 합니다:</p>
<ol>
<li>방대한 로고 데이터 세트를 준비합니다. 시스템에서 <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">이와</a> 같은 데이터 세트를 사용할 수 있습니다.)</li>
<li>데이터 세트와 데이터 기반 모델 또는 AI 알고리즘을 사용하여 이미지 특징 추출 모델을 훈련합니다.</li>
<li>2단계에서 학습된 모델 또는 알고리즘을 사용하여 로고를 벡터로 변환합니다.</li>
<li>벡터를 저장하고 오픈 소스 벡터 데이터베이스인 Milvus에서 벡터 유사도 검색을 수행합니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>다음 섹션에서는 상표에 대한 벡터 유사도 검색 시스템을 구축하는 두 가지 주요 단계, 즉 이미지 특징 추출을 위한 AI 모델 사용과 벡터 유사도 검색을 위한 Milvus 사용에 대해 자세히 살펴보겠습니다. 저희의 경우 이미지 특징을 추출하고 이를 임베딩 벡터로 변환하기 위해 컨볼루션 신경망(CNN)인 VGG16을 사용했습니다.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">이미지 특징 추출에 VGG16 사용</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16은</a> 대규모 이미지 인식을 위해 설계된 CNN입니다. 이 모델은 이미지 인식이 빠르고 정확하며 모든 크기의 이미지에 적용할 수 있습니다. 다음은 VGG16 아키텍처의 두 가지 그림입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>VGG16 모델은 이름에서 알 수 있듯이 16개의 레이어를 가진 CNN입니다. VGG16과 VGG19를 포함한 모든 VGG 모델은 5개의 VGG 블록을 포함하며, 각 VGG 블록에는 하나 이상의 컨볼루션 레이어가 있습니다. 그리고 각 블록의 끝에는 입력 이미지의 크기를 줄이기 위해 최대 풀링 레이어가 연결됩니다. 커널의 수는 각 컨볼루션 레이어 내에서 동일하지만 각 VGG 블록에서는 두 배가 됩니다. 따라서 모델의 커널 수는 첫 번째 블록에서 64개에서 네 번째와 다섯 번째 블록에서 512개로 증가합니다. 모든 컨볼루션 커널은<em>33개 크기인 반면 풀링 커널은 모두 22개 크기입니다</em>. 이는 입력 이미지에 대한 더 많은 정보를 보존하는 데 도움이 됩니다.</p>
<p>따라서 VGG16은 이 경우 대규모 데이터 세트의 이미지 인식에 적합한 모델입니다. 파이썬, 텐서플로우, Keras를 사용하여 VGG16을 기반으로 이미지 특징 추출 모델을 훈련할 수 있습니다.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">벡터 유사도 검색에 Milvus 사용</h3><p>VGG16 모델을 사용하여 이미지 특징을 추출하고 로고 이미지를 임베딩 벡터로 변환한 후에는 방대한 데이터 세트에서 유사한 벡터를 검색해야 합니다.</p>
<p>Milvus는 높은 확장성과 탄력성을 갖춘 클라우드 네이티브 데이터베이스입니다. 또한 데이터베이스로서 데이터 일관성을 보장할 수 있습니다. 이와 같은 상표 유사도 검색 시스템의 경우, 최신 상표 등록과 같은 새로운 데이터가 실시간으로 시스템에 업로드됩니다. 그리고 이렇게 새로 업로드된 데이터는 즉시 검색에 사용할 수 있어야 합니다. 따라서 이 글에서는 오픈소스 벡터 데이터베이스인 Milvus를 사용하여 벡터 유사도 검색을 수행합니다.</p>
<p>로고 벡터를 삽입할 때 상표 등록을 위한 상품 및 서비스 분류 체계인 <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">국제(니스) 상품 및 서비스 분류에</a> 따라 로고 벡터의 종류별로 Milvus에서 컬렉션을 만들 수 있습니다. 예를 들어 Milvus에서 의류 브랜드 로고 벡터 그룹을 &quot;의류&quot;라는 컬렉션에 삽입하고 다른 기술 브랜드 로고 벡터 그룹을 &quot;기술&quot;이라는 다른 컬렉션에 삽입할 수 있습니다. 이렇게 하면 벡터 유사도 검색의 효율성과 속도를 크게 높일 수 있습니다.</p>
<p>Milvus는 벡터 유사도 검색을 위한 여러 인덱스를 지원할 뿐만 아니라 DevOps를 용이하게 하는 풍부한 API와 도구도 제공합니다. 다음 다이어그램은 <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">Milvus 아키텍처를</a> 설명하는 그림입니다. Milvus에 대한 자세한 내용은 <a href="https://milvus.io/docs/v2.0.x/overview.md">소개글에서</a> 확인할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">더 많은 리소스를 찾고 계신가요?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Milvus로 다른 애플리케이션 시나리오를 위한 더 많은 벡터 유사도 검색 시스템을 구축하세요:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Milvus 기반 DNA 서열 분류</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Milvus 기반 오디오 검색</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">비디오 검색 시스템을 구축하는 4단계</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">NLP와 Milvus로 지능형 QA 시스템 구축하기</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">신약 개발 가속화</a></li>
</ul></li>
<li><p>오픈 소스 커뮤니티에 참여하세요:</p>
<ul>
<li><a href="https://bit.ly/307b7jC">GitHub에서</a> Milvus를 찾거나 기여하세요.</li>
<li><a href="https://bit.ly/3qiyTEk">포럼을</a> 통해 커뮤니티와 소통하세요.</li>
<li><a href="https://bit.ly/3ob7kd8">트위터에서</a> 소통하세요.</li>
</ul></li>
</ul>
