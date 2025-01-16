---
id: 2021-11-10-milvus-hacktoberfest-2021.md
title: 结束了2021 年 Milvus 黑客节
author: Zilliz
date: 2021-11-10T00:00:00.000Z
desc: 感谢参与 Milvus 2021 黑客节的所有人！
cover: assets.zilliz.com/It_s_a_wrap_9c0b9f0b38.png
tag: Events
---
<custom-h1>结束 - Milvus 2021 黑客节</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_cover_a6ce8748d7.jpeg" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>图片</span> </span></p>
<p>黑客节已经结束，但对开源项目的贡献却没有结束！</p>
<p>整个 10 月份，我们的仓库中共收到来自<strong>36 个贡献者</strong>（不包括我们的核心团队）的<strong>44 个拉动请求</strong>（PR）。虽然 Milvus 社区是第一年参加 Hacktoberfest，但参与人数超出了我们的预期，这表明开源精神的意识在不断增强。</p>
<p>我们希望每一个参与这次活动的人都能在这个过程中获得一些开源、社区的实践经验或知识，以及有用的技术技能。</p>
<p>在这篇文章中，我们想邀请你一起庆祝我们的成就，以及如何在Hacktoberfest之后继续为Milvus做出贡献。</p>
<h2 id="📣-Shout-out-to-our-contributors" class="common-anchor-header"><strong>向我们的贡献者致敬：</strong><button data-href="#📣-Shout-out-to-our-contributors" class="anchor-icon" translate="no">
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
    </button></h2><p>在今年的黑客节期间，Milvus 项目仓库<strong>合并了 44 个拉请求</strong>！这对各方来说都是一项巨大的成就。大家干得好！🎉</p>
<p><a href="https://github.com/parthiv11">parthiv11</a>、<a href="https://github.com/joremysh">joremysh</a>、<a href="https://github.com/noviicee">noviicee</a>、<a href="https://github.com/Biki-das">Biki-das</a>、<a href="https://github.com/Nadyamilona">Nadyamilona</a>、<a href="https://github.com/ashish4arora">ashish4arora</a>、<a href="https://github.com/Dhruvacube">Dhruvacube</a>、<a href="https://github.com/iamartyaa">iamartyaa</a>、<a href="https://github.com/RafaelDSS">RafaelDSS</a>、<a href="https://github.com/kartikcho">kartikcho</a>、<a href="https://github.com/daniel-shuy">GuyKh</a>、<a href="https://github.com/daniel-shuy">Deep1Shikha</a>、<a href="https://github.com/shreemaan-abhishek">shreemaan-abhishek</a>、<a href="https://github.com/daniel-shuy">daniel</a> <a href="https://github.com/shreemaan-abhishek">-</a> <a href="https://github.com/daniel-shuy">shuy</a>、<a href="https://github.com/Hard-Coder05">Hard-Coder05</a>、<a href="https://github.com/sapora1">sapora1</a>、<a href="https://github.com/Rutam21">Rutam21</a>、<a href="https://github.com/idivyanshbansal">idivyanshbansal</a>、<a href="https://github.com/Mihir501">Mihir501</a>、<a href="https://github.com/Ayushchaudhary-Github">YushChaudhary</a>、<a href="https://github.com/sreyan-ghosh">sreyan-ghosh</a>、<a href="https://github.com/chiaramistro">chiaramistro</a>、<a href="https://github.com/appledora">appledora</a>、<a href="https://github.com/luisAzcuaga">luisAzcuaga</a>、<a href="https://github.com/matteomessmer">matteomessmer</a>、<a href="https://github.com/Nadyamilona">Nadyamilona</a>、<a href="https://github.com/Tititesouris">Tititesouris</a>、<a href="https://github.com/amusfq">amusfq</a>、<a href="https://github.com/matrixji">matrixji</a>&amp;<a href="https://github.com/zamanmub">GeneralZman</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/_80b0d87746.png" alt="image-20211110180357460" class="doc-image" id="image-20211110180357460" />
   </span> <span class="img-wrapper"> <span>image-20211110180357460</span> </span></p>
<h3 id="Here-are-some-extraordinary-Milvus-Hacktoberfest-2021-contributions" class="common-anchor-header">以下是一些非同寻常的 Milvus 黑客节 2021 贡献：</h3><p><strong>⚙️ 新功能</strong></p>
<p><a href="https://github.com/milvus-io/milvus/issues/7706">跨平台编译和运行 Milvus</a>，作者：<a href="https://github.com/matrixji">matrixji</a></p>
<p><strong>(顶级贡献者 🏆 )</strong></p>
<p><strong>📝 文档</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/issues/720">将 Hello Milvus (example_code.md) 翻译为任何语言</a>，作者：<a href="https://github.com/chiaramistro">chiaramistro</a>,<a href="https://github.com/appledora">appledora</a>,<a href="https://github.com/luisAzcuaga">luisAzcuaga</a>,<a href="https://github.com/matteomessmer">matteomessmer</a>,<a href="https://github.com/Nadyamilona">Nadyamilona</a>,<a href="https://github.com/Tititesouris">Tititesouris</a>&amp;<a href="https://github.com/amusfq">amusfq</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/issues/720">在 example_code.md 中添加 NodeJS 示例</a>by<a href="https://github.com/GuyKh">GuyKh</a></li>
<li><a href="https://github.com/milvus-io/milvus-docs/pull/921/files">翻译 upgrade.md</a>并<a href="https://github.com/milvus-io/milvus-docs/pull/892">添加和翻译《用户指南》中的参数至 CN</a>by<a href="https://github.com/joremysh">joremysh</a></li>
<li><a href="https://github.com/milvus-io/milvus-docs/pull/753">将 tutorials/dna_sequence_classification.md 翻译成 CN</a>&amp;<a href="https://github.com/milvus-io/milvus-docs/pull/752">将 reference/schema/collection_schema.md 翻译成 CN</a>by<a href="https://github.com/daniel-shuy">daniel-shuy</a></li>
</ul>
<p><strong>🚀训练营</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/pull/858">增强 Jupyter Notebook 的图像哈希搜索教程 </a>，作者：<a href="https://github.com/zamanmub">generalZman</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/pull/792">修复 reverse_image_search 的 TOPK 错误</a>，作者：<a href="https://github.com/RafaelDSS">RafaelDSS</a></li>
</ul>
<p><strong>🐍 PyMilvus</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/pymilvus/issues/741">更新 GitHub 问题表单 </a>（多个 repos），作者<a href="https://github.com/Hard-Coder05">Hard-Coder05</a></li>
</ul>
<h3 id="Share-your-feedback-with-us" class="common-anchor-header">与我们分享您的反馈！</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h3_412b0f649b.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>图像</span> </span></p>
<p>非常欢迎您与我们分享您参加 Milvus Hacktoberfest 2021 的经历！无论是博文、推特（@milvusio）还是在我们的<a href="https://discuss.milvus.io/c/hacktoberfest/9">论坛</a>上发帖，我们都将不胜感激！</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步计划？<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="👩‍💻-Code--Documentation" class="common-anchor-header"><strong>👩‍💻</strong> <strong>代码和文档</strong></h3><p>如果你对 Milvus 的了解有限，你可以先通过贡献到<a href="https://github.com/milvus-io/pymilvus">pymilvus</a>或<a href="https://github.com/milvus-io/milvus-docs">docs</a>仓库来熟悉社区是如何工作的。您还可以查找<strong>#goodfirstissue</strong>或<strong>#helpwanted</strong> 等标签。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h4_f18c9b6c2c.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>图片</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h5_a4f90c24a8.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>图片</span> </span></p>
<p>如果您有任何关于贡献的问题，可以随时在论坛的<strong>贡献者</strong>类别下向社区提问：https://discuss.milvus.io/t/things-you-need-to-know-before-you-get-started/64。</p>
<h3 id="🏆-Be-a-Milvus-Advocate" class="common-anchor-header">成为 Milvus 倡导者</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/advocate_1052d8249a.jpg" alt="image-20211110180730866" class="doc-image" id="image-20211110180730866" />
   </span> <span class="img-wrapper"> <span>image-20211110180730866</span> </span></p>
<p>与社区分享您的经验和心得；提出改进意见；回答问题并帮助 Milvus 论坛上的其他成员等。您可以通过多种方式参与社区活动，我们在下面列出了几个例子，但我们欢迎任何形式的贡献：</p>
<ul>
<li><p><strong>演示和解决方案：</strong>向 Milvus 用户展示如何在特定场景中利用平台（如音乐推荐系统）。可在<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> 中获取示例。</p></li>
<li><p><strong>博客文章、用户故事或白皮书：</strong>撰写高质量的内容，清晰准确地解释 Milvus 的技术细节。</p></li>
<li><p><strong>技术讲座/现场直播：</strong>举办讲座或现场直播，帮助提高人们对 Milvus 的认识。</p></li>
<li><p><strong>其他：</strong>任何对 Milvus 及其开源社区的发展起到积极作用的内容都将被视为合格内容。</p></li>
</ul>
<p>更多详情，请阅读： https://milvus.io/community/milvus_advocate.md</p>
<p>最后，再次感谢你们参加今年的 Hacktoberfest，让我们成为你们的导师和学生。感谢<a href="https://hacktoberfest.digitalocean.com/">Digital Ocean</a>主办了又一年的精彩活动。下次再见！</p>
<p>编码快乐</p>
<p>Milvus 社区团队</p>
