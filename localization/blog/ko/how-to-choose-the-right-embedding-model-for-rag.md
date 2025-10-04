---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: 'Word2Vec에서 LLM2Vec으로: RAG에 적합한 임베딩 모델을 선택하는 방법'
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: 이 블로그에서는 실제로 임베딩을 평가하는 방법을 안내하여 RAG 시스템에 가장 적합한 임베딩을 선택할 수 있도록 도와드립니다.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>대규모 언어 모델은 강력하지만 환각이라는 잘 알려진 약점이 있습니다. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">검색 증강 생성(RAG)</a> 은 이 문제를 해결할 수 있는 가장 효과적인 방법 중 하나입니다. RAG는 모델의 기억에만 의존하는 대신 외부 소스에서 관련 지식을 검색하여 프롬프트에 통합함으로써 실제 데이터에 근거한 답변을 제공합니다.</p>
<p>RAG 시스템은 일반적으로 LLM 자체, 정보 저장 및 검색을 위한 <a href="https://milvus.io/">Milvus와</a> 같은 <a href="https://zilliz.com/learn/what-is-vector-database">벡터 데이터베이스</a>, 임베딩 모델이라는 세 가지 주요 구성 요소로 이루어져 있습니다. 임베딩 모델은 인간의 언어를 기계가 읽을 수 있는 벡터로 변환하는 역할을 합니다. 자연어와 데이터베이스 사이의 번역기라고 생각하면 됩니다. 이 번역기의 품질에 따라 검색된 문맥의 관련성이 결정됩니다. 제대로 번역하면 사용자는 정확하고 유용한 답변을 볼 수 있습니다. 잘못하면 아무리 좋은 인프라라도 노이즈와 오류, 컴퓨팅 낭비가 발생합니다.</p>
<p>그렇기 때문에 임베딩 모델을 이해하는 것이 매우 중요합니다. Word2Vec과 같은 초기 방식부터 OpenAI의 텍스트 임베딩 제품군과 같은 최신 LLM 기반 모델에 이르기까지 다양한 임베딩 모델이 있습니다. 각 모델에는 고유한 장단점과 장점이 있습니다. 이 가이드에서는 복잡한 내용을 정리하고 실제로 임베딩을 평가하는 방법을 보여줌으로써 RAG 시스템에 가장 적합한 것을 선택할 수 있도록 도와드립니다.</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">임베딩이란 무엇이며 왜 중요한가요?<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>가장 간단한 수준에서 임베딩은 인간의 언어를 기계가 이해할 수 있는 숫자로 변환하는 것입니다. 모든 단어, 문장 또는 문서는 고차원 벡터 공간에 매핑되며, 벡터 사이의 거리는 이들 사이의 관계를 포착합니다. 비슷한 의미를 가진 텍스트는 서로 뭉치는 경향이 있는 반면, 관련이 없는 콘텐츠는 더 멀리 떨어져 있는 경향이 있습니다. 이것이 시맨틱 검색을 가능하게 하는 원리로, 단순히 키워드를 일치시키는 것이 아니라 의미를 찾아내는 것입니다.</p>
<p>임베딩 모델은 모두 같은 방식으로 작동하지는 않습니다. 임베딩 모델은 일반적으로 세 가지 범주로 나뉘며, 각각의 장점과 단점이 있습니다:</p>
<ul>
<li><p>BM25와 같은<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>스파스 벡터는</strong></a> 키워드 빈도와 문서 길이에 중점을 둡니다. 명시적인 일치에는 적합하지만 동의어와 문맥을 무시합니다. 'AI'와 '인공 지능'은 서로 관련이 없는 것처럼 보일 수 있습니다.</p></li>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>고밀도 벡터</strong></a> (BERT에서 생성된 것과 같은)는 더 깊은 의미를 포착합니다. 공유 키워드 없이도 '애플이 새 휴대폰을 출시하다'가 '아이폰 제품 출시'와 연관되어 있음을 알 수 있습니다. 단점은 계산 비용이 더 많이 들고 해석 가능성이 떨어진다는 것입니다.</p></li>
<li><p><strong>하이브리드 모델</strong> (예: BGE-M3)은 이 두 가지를 결합합니다. 이 모델은 희소, 고밀도 또는 다중 벡터 표현을 동시에 생성할 수 있어 키워드 검색의 정밀도를 유지하면서 의미론적 뉘앙스도 포착할 수 있습니다.</p></li>
</ul>
<p>실제로는 속도와 투명성을 위해 스파스 벡터를, 더 풍부한 의미를 위해 밀도를, 두 가지 장점을 모두 원할 때는 하이브리드를 선택하는 등 사용 사례에 따라 선택해야 합니다.</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">임베딩 모델 평가를 위한 8가지 핵심 요소<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1위 컨텍스트 창</strong></h3><p><a href="https://zilliz.com/glossary/context-window"><strong>컨텍스트 창은</strong></a> 모델이 한 번에 처리할 수 있는 텍스트의 양을 결정합니다. 하나의 토큰은 대략 0.75단어이므로 이 수치는 임베딩을 만들 때 모델이 '볼 수 있는' 구절의 길이를 직접적으로 제한합니다. 창이 크면 모델이 긴 문서의 전체 의미를 파악할 수 있지만, 창이 작으면 텍스트를 잘게 잘라서 의미 있는 문맥이 손실될 위험이 있습니다.</p>
<p>예를 들어, OpenAI의 <a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>텍스트 임베딩-ada-002는</em></a> 최대 8,192개의 토큰을 지원하며, 이는 초록, 방법, 결론을 포함한 전체 연구 논문을 커버하기에 충분합니다. 반면, 512개의 토큰 창만 있는 모델(예: <em>m3e-base</em>)은 자주 잘려야 하므로 주요 세부 정보가 손실될 수 있습니다.</p>
<p>결론: 법적 서류나 학술 논문과 같이 긴 문서가 포함된 사용 사례라면 8K 이상의 토큰 창이 있는 모델을 선택하세요. 고객 지원 채팅과 같이 짧은 텍스트의 경우 2K 토큰 창으로도 충분할 수 있습니다.</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header">#<strong>2</strong> 토큰화 단위</h3><p>임베딩을 생성하기 전에 텍스트를 <strong>토큰이라는</strong> 작은 덩어리로 분해해야 합니다. 이 토큰화 방식은 모델이 희귀 단어, 전문 용어 및 전문 도메인을 얼마나 잘 처리하는지에 영향을 미칩니다.</p>
<ul>
<li><p><strong>하위 단어 토큰화(BPE):</strong> 단어를 더 작은 부분으로 분할합니다(예: "불행" → "un" + "행복"). 이는 GPT 및 LLaMA와 같은 최신 LLM의 기본값이며, 어휘에서 벗어난 단어에 적합합니다.</p></li>
<li><p><strong>워드피스:</strong> BERT에서 사용하는 BPE를 개선한 것으로, 어휘 범위와 효율성의 균형을 맞추기 위해 고안되었습니다.</p></li>
<li><p><strong>단어 수준 토큰화:</strong> 전체 단어 단위로만 분할합니다. 간단하지만 희귀하거나 복잡한 용어를 처리하는 데 어려움이 있어 기술 분야에는 적합하지 않습니다.</p></li>
</ul>
<p>의학이나 법률과 같은 전문 분야의 경우 일반적으로 <em>심근경색이나</em> <em>대위변제와</em> 같은 용어를 정확하게 처리할 수 있는 하위 단어 기반 모델이 가장 적합합니다. <strong>NV-Embed와</strong> 같은 일부 최신 모델은 잠재 주의 계층과 같은 향상된 기능을 추가하여 토큰화가 복잡한 도메인별 어휘를 캡처하는 방식을 개선합니다.</p>
<h3 id="3-Dimensionality" class="common-anchor-header">#3 차원성</h3><p><a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>벡터 차원은</strong></a> 임베딩 벡터의 길이를 의미하며, 이는 모델이 얼마나 많은 의미론적 세부 사항을 포착할 수 있는지를 결정합니다. 차원이 높을수록(예: 1,536 이상) 개념 간의 구분이 더 세밀해지지만 저장 공간이 증가하고 쿼리 속도가 느려지며 컴퓨팅 요구 사항이 높아지는 대가가 따릅니다. 더 낮은 차원(예: 768)은 더 빠르고 저렴하지만 미묘한 의미를 잃을 위험이 있습니다.</p>
<p>핵심은 균형입니다. 대부분의 범용 애플리케이션의 경우 768-1,536 차원이 효율성과 정확성의 적절한 조합을 이룹니다. 학술적 또는 과학적 검색과 같이 높은 정밀도가 요구되는 작업의 경우 2,000개 이상의 차원을 사용하는 것이 가치가 있을 수 있습니다. 반면에 리소스가 제한된 시스템(예: 엣지 배포)에서는 검색 품질이 검증된 경우 512개의 차원을 효과적으로 사용할 수 있습니다. 일부 경량 추천 또는 개인화 시스템에서는 이보다 더 작은 차원으로도 충분할 수 있습니다.</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">#4 어휘 크기</h3><p>모델의 <strong>어휘 크기는</strong> 토큰화기가 인식할 수 있는 고유 토큰의 수를 나타냅니다. 이는 다양한 언어와 도메인별 용어를 처리하는 능력에 직접적인 영향을 미칩니다. 어휘에 없는 단어나 문자는 <code translate="no">[UNK]</code> 로 표시되어 의미가 손실될 수 있습니다.</p>
<p>요구 사항은 사용 사례에 따라 다릅니다. 다국어 시나리오에서는 일반적으로 <a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3의</em></a> 경우처럼 5만 개 이상의 토큰으로 구성된 대규모 어휘가 필요합니다. 도메인별 애플리케이션의 경우 전문 용어에 대한 커버리지가 가장 중요합니다. 예를 들어 법률 모델은 <em>'소멸시효</em> ' 또는 '선의의 <em> 취득'</em>과 같은 용어를 기본적으로 지원해야 하며, 중국어 모델은 수천 개의 문자와 고유한 구두점을 고려해야 합니다. 어휘 범위가 충분하지 않으면 임베딩 정확도가 빠르게 떨어집니다.</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># 5번 훈련 데이터</h3><p><strong>학습 데이터는</strong> 임베딩 모델이 "알고 있는" 것의 경계를 정의합니다. 웹 페이지, 책, Wikipedia를 혼합하여 사용하는 <em>텍스트 임베딩-ada-002와</em> 같은 광범위한 범용 데이터로 훈련된 모델은 다양한 도메인에서 우수한 성능을 발휘하는 경향이 있습니다. 하지만 전문 분야에서 정밀도가 필요한 경우에는 도메인에 맞게 학습된 모델이 승리하는 경우가 많습니다. 예를 들어 법률 및 생물의학 텍스트에서 <em>LegalBERT와</em> <em>BioBERT는</em> 일반화 능력은 다소 떨어지지만 일반 모델보다 성능이 뛰어납니다.</p>
<p>경험 법칙:</p>
<ul>
<li><p><strong>일반 시나리오</strong> → 광범위한 데이터 세트에 대해 학습된 모델을 사용하되, 대상 언어에 맞는지 확인하세요. 예를 들어 중국어 애플리케이션에는 풍부한 중국어 말뭉치로 학습된 모델이 필요합니다.</p></li>
<li><p><strong>수직적 도메인</strong> → 최상의 정확도를 위해 도메인별 모델을 선택하세요.</p></li>
<li><p>두 가지 장점을<strong>모두</strong> 갖춘 모델 → 일반 데이터와 도메인별 데이터로 두 단계에 걸쳐 학습된 <strong>NV-Embed와</strong> 같은 최신 모델은 일반화 <em>및</em> 도메인 정확도 측면에서 유망한 이점을 보여줍니다.</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6위 비용</h3><p>비용은 단순히 API 가격만 의미하는 것이 아니라 <strong>경제적 비용</strong> 과 <strong>컴퓨팅 비용을</strong> 모두 포함합니다. OpenAI의 모델과 같은 호스팅 API 모델은 사용량 기반이므로 통화당 비용을 지불하지만 인프라에 대한 걱정은 없습니다. 따라서 신속한 프로토타이핑, 파일럿 프로젝트 또는 중소규모 워크로드에 적합합니다.</p>
<p><em>BGE</em> 또는 <em>Sentence-BERT와</em> 같은 오픈 소스 옵션은 무료로 사용할 수 있지만 자체 관리 인프라(일반적으로 GPU 또는 TPU 클러스터)가 필요합니다. 이러한 옵션은 장기적인 비용 절감과 유연성이 일회성 설정 및 유지 관리 비용을 상쇄하는 대규모 프로덕션에 더 적합합니다.</p>
<p>실용적인 팁 <strong>API 모델은 빠른 반복 작업에 이상적이지만</strong>, 총소유비용(TCO)을 고려하면 <strong>대규모 생산에서는 오픈 소스 모델이 더 유리한</strong> 경우가 많습니다. 올바른 경로를 선택하는 것은 시장 출시 속도가 필요한지, 장기적인 제어가 필요한지에 따라 달라집니다.</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># 7위 MTEB 점수</h3><p><a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>대규모 텍스트 임베딩 벤치마크(MTEB)</strong></a> 는 임베딩 모델을 비교하는 데 가장 널리 사용되는 표준입니다. 시맨틱 검색, 분류, 클러스터링 등 다양한 작업 전반의 성능을 평가합니다. 점수가 높을수록 일반적으로 모델이 다양한 유형의 작업에서 더 강력한 일반화 가능성을 가지고 있음을 의미합니다.</p>
<p>하지만 MTEB가 만능은 아닙니다. 전반적으로 높은 점수를 받은 모델이라도 특정 사용 사례에서는 여전히 성능이 떨어질 수 있습니다. 예를 들어, 주로 영어에 대해 훈련된 모델은 MTEB 벤치마크에서는 좋은 성능을 보이지만 전문 의학 텍스트나 비영어권 데이터에서는 어려움을 겪을 수 있습니다. 안전한 접근 방식은 MTEB를 시작점으로 사용한 다음 커밋하기 전에 <strong>자체 데이터 세트로</strong> 검증하는 것입니다.</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8번 도메인 특이성</h3><p>일부 모델은 특정 시나리오를 위해 특별히 제작된 것으로, 일반적인 모델이 부족한 분야에서 빛을 발합니다:</p>
<ul>
<li><p><strong>바로 법률 분야입니다:</strong> <em>LegalBERT는</em> <em>방어와</em> <em>관할권</em> 등 세분화된 법률 용어를 구분할 수 있습니다.</p></li>
<li><p><strong>바이오메디컬:</strong> <em>BioBERT는</em> <em>mRNA</em> 또는 <em>표적 치료와</em> 같은 기술적인 문구를 정확하게 처리합니다.</p></li>
<li><p><strong>다국어:</strong> <em>BGE-M3는</em> 100개 이상의 언어를 지원하므로 영어, 중국어 및 기타 언어의 브리징이 필요한 글로벌 애플리케이션에 적합합니다.</p></li>
<li><p><strong>코드 검색:</strong> <em>Qwen3-Embedding은</em> 프로그래밍 관련 쿼리에 최적화된 <em>MTEB-Code에서</em> 최고 점수(81.0점 이상)를 획득했습니다.</p></li>
</ul>
<p>사용 사례가 이러한 도메인 중 하나에 해당하는 경우, 도메인에 최적화된 모델을 사용하면 검색 정확도를 크게 향상시킬 수 있습니다. 그러나 더 광범위한 애플리케이션의 경우, 테스트에서 달리 나타나지 않는 한 범용 모델을 고수하세요.</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">임베딩을 평가하기 위한 추가적인 관점<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>핵심 8가지 요소 외에도 보다 심층적인 평가를 원한다면 고려할 만한 몇 가지 다른 관점이 있습니다:</p>
<ul>
<li><p><strong>다국어 정렬</strong>: 다국어 모델의 경우 단순히 많은 언어를 지원하는 것만으로는 충분하지 않습니다. 실제 테스트는 벡터 공간이 정렬되어 있는지 여부입니다. 즉, 의미적으로 동일한 단어(예: 영어의 '고양이'와 스페인어의 '가토'가 벡터 공간에서 서로 가깝게 매핑되나요? 강력한 정렬은 일관된 언어 간 검색을 보장합니다.</p></li>
<li><p><strong>적대적 테스트</strong>: 좋은 임베딩 모델은 작은 입력 변화에도 안정적이어야 합니다. 거의 동일한 문장(예: "고양이는 매트 위에 앉았다"와 "고양이는 매트 위에 앉았다")을 입력하면 결과 벡터가 합리적으로 이동하는지 아니면 크게 변동하는지 테스트할 수 있습니다. 큰 변동은 종종 견고성이 약하다는 것을 나타냅니다.</p></li>
<li><p><strong>로컬 의미적 일관성은</strong> 의미적으로 유사한 단어들이 로컬 지역에서 밀집되어 있는지 테스트하는 현상을 말합니다. 예를 들어, '은행'과 같은 단어가 주어지면 모델은 관련 용어('강둑', '금융 기관' 등)를 적절히 그룹화하고 관련 없는 용어는 거리를 유지해야 합니다. 이러한 영역에 '방해가 되는' 또는 관련 없는 단어가 얼마나 자주 들어오는지 측정하면 모델 품질을 비교하는 데 도움이 됩니다.</p></li>
</ul>
<p>이러한 관점이 일상적인 작업에 항상 필요한 것은 아니지만 다국어, 고정밀 또는 역방향 안정성이 중요한 프로덕션 시스템에서 임베딩을 스트레스 테스트하는 데 유용합니다.</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">일반적인 임베딩 모델: 간략한 역사<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>임베딩 모델에 대한 이야기는 시간이 지남에 따라 기계가 언어를 더 깊이 이해하는 방법을 학습해 온 이야기입니다. 각 세대는 정적인 단어 표현에서 미묘한 문맥을 포착할 수 있는 오늘날의 대규모 언어 모델(LLM) 임베딩에 이르기까지 이전 세대의 한계를 뛰어넘어 왔습니다.</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec: 시작점 (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">Google의 Word2Vec은</a> 임베딩을 널리 실용화시킨 최초의 획기적인 기술입니다. 언어학의 <em>분포 가설</em>, 즉 비슷한 문맥에 등장하는 단어는 종종 의미를 공유한다는 가설에 기반한 것이었습니다. 방대한 양의 텍스트를 분석하여 Word2Vec은 단어를 벡터 공간에 매핑하여 관련 용어가 서로 가깝게 배치되도록 했습니다. 예를 들어, '퓨마'와 '표범'은 서식지와 사냥 특성이 비슷해 근처에 모여 있었습니다.</p>
<p>Word2Vec은 두 가지 방식으로 제공됩니다:</p>
<ul>
<li><p><strong>CBOW(연속 단어 가방):</strong> 주변 문맥에서 누락된 단어를 예측합니다.</p></li>
<li><p><strong>스킵그램:</strong> 목표 단어에서 주변 단어를 역으로 예측합니다.</p></li>
</ul>
<p>이 간단하지만 강력한 접근 방식 덕분에 다음과 같은 우아한 비유가 가능했습니다:</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>당시로서는 Word2Vec이 혁신적이었습니다. 하지만 두 가지 중요한 한계가 있었습니다. 첫째, 각 단어에는 하나의 벡터만 있었기 때문에 "은행"이 "돈"이나 "강" 근처에 있든 없든 같은 의미였습니다. 둘째, <strong>단어 수준에서만</strong> 작동했기 때문에 문장과 문서에는 적용되지 않았습니다.</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">버트: 트랜스포머 혁명 (2018)</h3><p>Word2Vec이 최초의 의미 지도를 제공했다면, <a href="https://zilliz.com/learn/what-is-bert"><strong>BERT(양방향 인코더 표현을 통한 트랜스포머</strong></a> )는 훨씬 더 세밀하게 의미 지도를 다시 그렸습니다. 2018년에 Google에서 출시한 BERT는 임베딩에 트랜스포머 아키텍처를 도입하여 <em>심층 의미 이해</em> 시대의 시작을 알렸습니다. 이전의 LSTM과 달리 트랜스포머는 시퀀스의 모든 단어를 동시에 양방향으로 검사할 수 있어 훨씬 더 풍부한 문맥을 파악할 수 있습니다.</p>
<p>BERT의 마법은 두 가지 영리한 사전 학습 작업에서 비롯되었습니다:</p>
<ul>
<li><p><strong>마스크드 언어 모델링(MLM):</strong> 문장에서 단어를 무작위로 숨기고 모델이 이를 예측하도록 하여 문맥에서 의미를 유추하도록 학습시킵니다.</p></li>
<li><p><strong>다음 문장 예측(NSP):</strong> 두 문장이 서로 이어지는지 여부를 판단하도록 모델을 훈련시켜 문장 간의 관계를 학습하도록 돕습니다.</p></li>
</ul>
<p>BERT의 입력 벡터는 토큰 임베딩(단어 자체), 세그먼트 임베딩(어떤 문장에 속하는지), 위치 임베딩(시퀀스에서 어디에 있는지)의 세 가지 요소를 결합했습니다. 이를 통해 BERT는 <strong>문장과</strong> <strong>문서</strong> 수준 모두에서 복잡한 의미 관계를 캡처할 수 있는 능력을 갖추게 되었습니다. 이러한 비약적인 발전을 통해 BERT는 질문 답변 및 시맨틱 검색과 같은 작업에 있어 최첨단 기술을 갖추게 되었습니다.</p>
<p>물론 BERT가 완벽했던 것은 아닙니다. 초기 버전은 <strong>512개의 토큰 창으로</strong> 제한되어 있었기 때문에 긴 문서를 잘게 쪼개야 했고 때로는 의미를 잃기도 했습니다. 또한 조밀한 벡터는 해석 가능성도 부족해 두 텍스트가 일치하는 것을 볼 수는 있지만 그 이유를 항상 설명할 수는 없었습니다. 이후 <strong>RoBERTa와</strong> 같은 변종은 강력한 MLM 훈련은 그대로 유지하면서 NSP 작업이 별다른 이점을 제공하지 못한다는 연구 결과가 나온 후 이를 삭제했습니다.</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3: 스파스와 밀도의 융합(2023년)</h3><p>2023년, 이 분야는 하나의 임베딩 방법으로는 모든 것을 달성할 수 없다는 것을 인식할 만큼 충분히 성숙해졌습니다. 검색 작업을 위해 명시적으로 설계된 하이브리드 모델인 <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a> (BAAI 일반 임베딩-M3)를 소개합니다. 이 모델의 핵심 혁신은 한 가지 유형의 벡터만 생성하는 것이 아니라 고밀도 벡터, 스파스 벡터, 멀티 벡터를 한 번에 생성하여 각각의 장점을 결합한다는 점입니다.</p>
<ul>
<li><p><strong>고밀도 벡터는</strong> 동의어와 의역어를 처리하여 깊은 의미를 포착합니다(예: "iPhone 출시", ≈ "Apple 출시 새 휴대폰").</p></li>
<li><p><strong>스파스 벡터는</strong> 명시적인 용어 가중치를 할당합니다. 키워드가 나타나지 않더라도 모델은 관련성을 추론할 수 있습니다(예: "iPhone 신제품"을 "Apple Inc." 및 "스마트폰"과 연결).</p></li>
<li><p><strong>멀티 벡터는</strong> 각 토큰이 자체적인 상호 작용 점수를 제공하도록 함으로써 밀집된 임베딩을 더욱 세분화하여 세밀한 검색에 유용합니다.</p></li>
</ul>
<p>BGE-M3의 훈련 파이프라인은 이러한 정교함을 반영합니다:</p>
<ol>
<li><p>일반적인 의미 이해를 구축하기 위해 <em>RetroMAE</em> (마스킹 인코더 + 재구성 디코더)로 라벨이 없는 대규모 데이터에 대한<strong>사전 학습</strong>.</p></li>
<li><p>1억 개의 텍스트 쌍에 대한 대조 학습을 사용하여 검색 성능을 향상시키는<strong>일반적인 미세 조정</strong>.</p></li>
<li><p>시나리오별 최적화를 위해 인스트럭션 튜닝과 복잡한 네거티브 샘플링으로<strong>작업 미세 조정</strong>.</p></li>
</ol>
<p>그 결과는 인상적입니다: BGE-M3는 단어 수준부터 문서 수준까지 다양한 세분성을 처리하고, 특히 중국어에서 강력한 다국어 성능을 제공하며, 대부분의 동종 제품보다 정확도와 효율성 간의 균형을 더 잘 맞추고 있습니다. 실제로, 이는 대규모 검색을 위한 강력하고 실용적인 임베딩 모델을 구축하는 데 있어 중요한 진전을 의미합니다.</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">임베딩 모델로서의 LLM(2023~현재)</h3><p>수년 동안 GPT와 같은 디코더 전용 대형 언어 모델(LLM)은 임베딩에 적합하지 않다는 것이 일반적인 통념이었습니다. 이전 토큰만 살펴보는 인과적 주의는 깊은 의미 이해를 제한한다고 여겨졌기 때문입니다. 하지만 최근의 연구는 이러한 가정을 뒤집었습니다. 적절한 조정을 통해 LLM은 특수 목적 모델에 필적하는, 때로는 이를 능가하는 임베딩을 생성할 수 있습니다. 주목할 만한 두 가지 예로 LLM2Vec과 NV-Embed가 있습니다.</p>
<p><strong>LLM2Vec은</strong> 세 가지 주요 변경 사항으로 디코더 전용 LLM을 조정합니다:</p>
<ul>
<li><p><strong>양방향 주의 전환</strong>: 인과 관계 마스크를 대체하여 각 토큰이 전체 시퀀스에 주의를 기울일 수 있도록 합니다.</p></li>
<li><p><strong>마스크된 다음 토큰 예측(MNTP):</strong> 양방향 이해를 장려하는 새로운 훈련 목표.</p></li>
<li><p><strong>비지도 대조 학습:</strong> SimCSE에서 영감을 받아 벡터 공간에서 의미적으로 유사한 문장을 서로 가깝게 끌어당깁니다.</p></li>
</ul>
<p>반면<strong>NV-Embed는</strong> 보다 간소화된 접근 방식을 취합니다:</p>
<ul>
<li><p><strong>잠재 주의 레이어:</strong> 훈련 가능한 '잠재 배열'을 추가하여 시퀀스 풀링을 개선합니다.</p></li>
<li><p><strong>직접 양방향 훈련:</strong> 인과 관계 마스크를 제거하고 대조 학습으로 미세 조정하기만 하면 됩니다.</p></li>
<li><p><strong>평균 풀링 최적화:</strong> "마지막 토큰 편향"을 방지하기 위해 토큰 전체에 가중 평균을 사용합니다.</p></li>
</ul>
<p>그 결과, 최신 LLM 기반 임베딩은 <strong>심층적인 의미 이해와</strong> <strong>확장성을</strong> 결합합니다. <strong>매우 긴 컨텍스트 윈도우(8K-32K 토큰)를</strong> 처리할 수 있어 연구, 법률 또는 기업 검색에서 문서가 많은 작업에 특히 강합니다. 또한 동일한 LLM 백본을 재사용하기 때문에 제약이 많은 환경에서도 고품질 임베딩을 제공할 수 있습니다.</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">결론: 이론을 실천으로 옮기기<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>임베딩 모델을 선택할 때 이론은 여기까지만 도움이 됩니다. 실제 테스트는 데이터와 함께 시스템에서 얼마나 잘 작동하는지입니다. 몇 가지 실용적인 단계를 거치면 서류상으로는 보기 좋은 모델과 실제 운영 환경에서 작동하는 모델 간에 차이를 만들 수 있습니다:</p>
<ul>
<li><p><strong>MTEB 하위 집합이 있는 화면.</strong> 벤치마크, 특히 검색 작업을 사용하여 초기 후보 목록을 작성하세요.</p></li>
<li><p><strong>실제 비즈니스 데이터로 테스트하세요.</strong> 자체 문서에서 평가 세트를 만들어 실제 조건에서 검색 회수율, 정확도, 지연 시간을 측정하세요.</p></li>
<li><p><strong>데이터베이스 호환성을 확인합니다.</strong> 스파스 벡터는 역 인덱스 지원이 필요하지만, 고차원 고밀도 벡터는 더 많은 저장 공간과 계산이 필요합니다. 벡터 데이터베이스가 사용자의 선택을 수용할 수 있는지 확인하세요.</p></li>
<li><p><strong>긴 문서를 스마트하게 처리하세요.</strong> 슬라이딩 창과 같은 세분화 전략을 활용하여 효율성을 높이고, 큰 컨텍스트 창 모델과 결합하여 의미를 보존하세요.</p></li>
</ul>
<p>Word2Vec의 간단한 정적 벡터부터 32K 컨텍스트가 포함된 LLM 기반 임베딩에 이르기까지, 기계가 언어를 이해하는 방식은 큰 발전을 거듭해 왔습니다. 하지만 모든 개발자가 결국 깨닫게 되는 교훈은 <em>점수가 가장 높은</em> 모델이 항상 사용 사례에 <em>가장 적합한</em> 모델은 아니라는 것입니다.</p>
<p>결국 사용자는 MTEB 리더보드나 벤치마크 차트에 신경 쓰지 않고 올바른 정보를 빠르게 찾고자 할 뿐입니다. 정확성, 비용, 시스템과의 호환성 사이에서 균형을 이루는 모델을 선택하면 이론적으로만 인상적인 것이 아니라 실제 세계에서 진정으로 작동하는 것을 구축할 수 있습니다.</p>
