---
id: deleting-data-in-milvus.md
title: 마무리
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: Milvus v0.7.0에서는 삭제를 더 효율적으로 하고 더 많은 인덱스 유형을 지원하기 위해 완전히 새로운 디자인을 고안했습니다.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Milvus가 삭제 기능을 구현하는 방법</custom-h1><p>이 글에서는 Milvus가 삭제 기능을 구현하는 방법에 대해 설명합니다. 많은 사용자들이 기다려온 기능인 삭제 기능은 Milvus v0.7.0에 도입되었습니다. FAISS에서 remove_ids를 직접 호출하지 않고, 대신 삭제를 더 효율적으로 하고 더 많은 인덱스 유형을 지원하기 위해 새로운 디자인을 고안했습니다.</p>
<p><a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">Milvus가 동적 데이터 업데이트 및 쿼리를 실현하는 방법에서는</a> 데이터 삽입부터 데이터 플러싱까지 전체 프로세스를 소개했습니다. 이제 몇 가지 기본 사항을 다시 한 번 정리해 보겠습니다. MemManager는 모든 삽입 버퍼를 관리하며, 각 MemTable은 컬렉션에 해당합니다(Milvus v0.7.0에서는 "테이블"의 이름을 "컬렉션"으로 변경했습니다). Milvus는 메모리에 삽입된 데이터를 자동으로 여러 개의 MemTableFile로 나눕니다. 데이터가 디스크에 플러시되면 각 MemTableFile은 원시 파일로 직렬화됩니다. 삭제 기능을 설계할 때 이 아키텍처를 유지했습니다.</p>
<p>삭제 메서드의 기능을 특정 컬렉션에서 지정된 엔티티 ID에 해당하는 모든 데이터를 삭제하는 것으로 정의합니다. 이 함수를 개발할 때 두 가지 시나리오를 설계했습니다. 첫 번째는 삽입 버퍼에 남아 있는 데이터를 삭제하는 것이고, 두 번째는 디스크에 플러시된 데이터를 삭제하는 것입니다. 첫 번째 시나리오가 더 직관적입니다. 지정된 ID에 해당하는 MemTableFile을 찾아 메모리에 있는 데이터를 직접 삭제할 수 있습니다(그림 1). 데이터 삭제와 삽입을 동시에 수행할 수 없고, 데이터를 플러시할 때 MemTableFile을 변경 가능에서 불변으로 변경하는 메커니즘 때문에 삭제는 변경 가능한 버퍼에서만 수행됩니다. 이렇게 하면 삭제 작업이 데이터 플러싱과 충돌하지 않으므로 데이터의 일관성을 보장할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-delete-request-milvus.jpg</span> </span></p>
<p>두 번째 시나리오는 더 복잡하지만 대부분의 경우 데이터가 디스크에 플러시되기 전에 삽입 버퍼에 잠시 머물러 있기 때문에 더 일반적입니다. 하드 삭제를 위해 플러시된 데이터를 메모리에 로드하는 것은 매우 비효율적이기 때문에 보다 효율적인 접근 방식인 소프트 삭제를 사용하기로 결정했습니다. 소프트 삭제는 플러시된 데이터를 실제로 삭제하는 대신 삭제된 ID를 별도의 파일에 저장합니다. 이렇게 하면 검색과 같은 읽기 작업 중에 삭제된 ID를 필터링할 수 있습니다.</p>
<p>구현과 관련하여 고려해야 할 몇 가지 문제가 있습니다. Milvus에서는 데이터가 디스크에 플러시될 때만 데이터를 볼 수 있고, 다시 말해 복구할 수 있습니다. 따라서 플러시된 데이터는 삭제 메서드 호출 중에 삭제되는 것이 아니라 다음 플러시 작업에서 삭제됩니다. 그 이유는 디스크에 플러시된 데이터 파일에는 더 이상 새 데이터가 포함되지 않으므로 소프트 삭제가 플러시된 데이터에 영향을 미치지 않기 때문입니다. 삭제를 호출할 때 삽입 버퍼에 남아 있는 데이터는 직접 삭제할 수 있지만 플러시된 데이터의 경우 삭제된 데이터의 ID를 메모리에 기록해야 합니다. 데이터를 디스크로 플러시할 때 Milvus는 삭제된 ID를 DEL 파일에 기록하여 해당 세그먼트에서 어떤 엔티티가 삭제되었는지 기록합니다. 이러한 업데이트는 데이터 플러시가 완료된 후에만 볼 수 있습니다. 이 프로세스는 그림 2에 설명되어 있습니다. v0.7.0 이전에는 자동 플러시 메커니즘, 즉 Milvus가 매초마다 삽입 버퍼의 데이터를 직렬화하는 메커니즘만 있었습니다. 새로운 설계에서는 개발자가 삭제 메서드 이후에 플러시 메서드를 호출하여 새로 삽입된 데이터가 표시되고 삭제된 데이터는 더 이상 복구할 수 없도록 할 수 있는 기능을 추가했습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-delete-request-milvus.jpg</span> </span></p>
<p>두 번째 문제는 원시 데이터 파일과 인덱스 파일이 Milvus에서 두 개의 개별 파일이고 메타데이터에서 두 개의 독립된 레코드라는 것입니다. 특정 ID를 삭제할 때 해당 ID에 해당하는 로우 파일과 인덱스 파일을 찾아서 함께 기록해야 합니다. 이에 따라 세그먼트 개념을 도입했습니다. 세그먼트에는 원시 파일(원시 벡터 파일과 ID 파일을 포함), 인덱스 파일, DEL 파일이 포함됩니다. 세그먼트는 Milvus에서 벡터를 읽고, 쓰고, 검색하기 위한 가장 기본적인 단위입니다. 컬렉션(그림 3)은 여러 세그먼트로 구성됩니다. 따라서 디스크의 컬렉션 폴더 아래에는 여러 개의 세그먼트 폴더가 있습니다. 메타데이터는 관계형 데이터베이스(SQLite 또는 MySQL)를 기반으로 하기 때문에 세그먼트 내의 관계를 기록하는 것이 매우 간단하며, 삭제 작업 시 원시 파일과 인덱스 파일을 별도로 처리할 필요가 없습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-delete-request-milvus.jpg</span> </span></p>
<p>세 번째 문제는 검색 중에 삭제된 데이터를 필터링하는 방법입니다. 실제로 DEL에 의해 기록되는 ID는 세그먼트에 저장된 해당 데이터의 오프셋입니다. 플러시된 세그먼트에는 새로운 데이터가 포함되지 않으므로 오프셋은 변경되지 않습니다. DEL의 데이터 구조는 메모리의 비트맵으로, 활성 비트는 삭제된 오프셋을 나타냅니다. 이에 따라 FAISS도 업데이트되었습니다. FAISS에서 검색하면 활성 비트에 해당하는 벡터가 더 이상 거리 계산에 포함되지 않습니다(그림 4). FAISS의 변경 사항은 여기서 자세히 다루지 않겠습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-delete-request-milvus.jpg</span> </span></p>
<p>마지막 이슈는 성능 개선에 관한 것입니다. 플러시된 데이터를 삭제할 때는 먼저 삭제된 ID가 컬렉션의 어느 세그먼트에 있는지 확인한 다음 해당 오프셋을 기록해야 합니다. 가장 간단한 접근 방식은 각 세그먼트의 모든 ID를 검색하는 것입니다. 저희가 고려 중인 최적화는 각 세그먼트에 블룸 필터를 추가하는 것입니다. 블룸 필터는 요소가 집합의 멤버인지 여부를 확인하는 데 사용되는 임의의 데이터 구조입니다. 따라서 각 세그먼트의 블룸 필터만 로드할 수 있습니다. 블룸 필터가 삭제된 ID가 현재 세그먼트에 있다고 판단할 때만 세그먼트에서 해당 오프셋을 찾을 수 있으며, 그렇지 않으면 이 세그먼트를 무시할 수 있습니다(그림 5). 블룸 필터를 선택한 이유는 해시 테이블과 같은 다른 필터보다 공간을 덜 사용하고 검색 효율이 높기 때문입니다. 블룸 필터는 일정 비율의 오탐률을 가지고 있지만 검색해야 하는 세그먼트를 이상적인 수로 줄여 확률을 조정할 수 있습니다. 한편, 블룸 필터는 삭제 기능도 지원해야 합니다. 그렇지 않으면 삭제된 엔티티 ID가 블룸 필터에서 여전히 발견될 수 있으므로 오탐률이 높아집니다. 이러한 이유로 저희는 삭제를 지원하는 카운팅 블룸 필터를 사용합니다. 이 문서에서는 블룸 필터의 작동 방식에 대해서는 자세히 설명하지 않습니다. 관심이 있으시면 위키백과를 참조하시기 바랍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-delete-request-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">마무리<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>지금까지 Milvus가 ID별로 벡터를 삭제하는 방법에 대해 간략하게 소개해 드렸습니다. 아시다시피 밀버스는 플러시된 데이터를 삭제할 때 소프트 삭제를 사용합니다. 삭제된 데이터가 증가하면 삭제된 데이터가 차지하는 공간을 확보하기 위해 컬렉션의 세그먼트를 압축해야 합니다. 또한 세그먼트가 이미 색인된 경우, 압축은 이전 색인 파일을 삭제하고 새 색인을 생성하기도 합니다. 현재로서는 개발자가 데이터를 압축하려면 압축 메서드를 호출해야 합니다. 앞으로는 검사 메커니즘을 도입할 예정입니다. 예를 들어, 삭제된 데이터의 양이 특정 임계값에 도달하거나 삭제 후 데이터 분포가 변경되면 Milvus는 자동으로 해당 세그먼트를 압축합니다.</p>
<p>지금까지 삭제 기능의 설계 철학과 그 구현에 대해 소개해 드렸습니다. 개선의 여지는 분명히 있으며, 여러분의 의견이나 제안을 환영합니다.</p>
<p>Milvus에 대해 자세히 알아보세요: https://github.com/milvus-io/milvus. 또한 커뮤니티 <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack에</a> 가입하여 기술적인 토론을 할 수도 있습니다!</p>
