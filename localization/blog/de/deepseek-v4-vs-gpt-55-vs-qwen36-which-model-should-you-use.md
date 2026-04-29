---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs. GPT-5.5 vs. Qwen3.6: Welches Modell sollten Sie verwenden?'
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Vergleichen Sie DeepSeek V4, GPT-5.5 und Qwen3.6 bei der Suche, der
  Fehlersuche und bei Tests mit langem Kontext und erstellen Sie dann eine
  Milvus-RAG-Pipeline mit DeepSeek V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>Neue Modellversionen werden schneller veröffentlicht, als die Produktionsteams sie bewerten können. DeepSeek V4, GPT-5.5 und Qwen3.6-35B-A3B sehen alle auf dem Papier gut aus, aber die schwierigere Frage für KI-Anwendungsentwickler ist die praktische: Welches Modell sollten Sie für abruflastige Systeme, Codierungsaufgaben, Langkontextanalysen und <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Pipelines</a> verwenden?</p>
<p><strong>In diesem Artikel werden die drei Modelle in praktischen Tests verglichen:</strong> Abrufen von Informationen in Echtzeit, Debugging bei gleichzeitiger Verwendung von Fehlern und Abrufen von Markern im langen Kontext. Anschließend wird gezeigt, wie DeepSeek V4 mit der <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank Milvus</a> verbunden werden kann, so dass der abgerufene Kontext aus einer durchsuchbaren Wissensdatenbank stammt und nicht nur aus den Parametern des Modells.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">Was sind DeepSeek V4, GPT-5.5, und Qwen3.6-35B-A3B?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5 und Qwen3.6-35B-A3B sind verschiedene KI-Modelle, die auf unterschiedliche Teile des Modellstapels abzielen.</strong> DeepSeek V4 konzentriert sich auf die Inferenz von langen Kontexten mit offenem Gewicht. GPT-5.5 konzentriert sich auf grenzwertig gehostete Leistung, Codierung, Online-Recherche und werkzeuglastige Aufgaben. Qwen3.6-35B-A3B konzentriert sich auf den multimodalen Einsatz mit offenem Gewicht und einem viel kleineren Fußabdruck für die aktiven Parameter.</p>
<p>Der Vergleich ist wichtig, weil ein <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">produktives Vektorsuchsystem</a> selten allein vom Modell abhängt. Die Fähigkeit des Modells, die Länge des Kontexts, die Steuerung der Bereitstellung, die Qualität des Abrufs und die Kosten für die Bereitstellung wirken sich alle auf das endgültige Benutzererlebnis aus.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: Ein MoE-Modell mit offenem Gewicht zur Kontrolle der Kosten für lange Kontexte</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>ist eine MoE-Modellfamilie mit offenem Gewicht, die am 24. April 2026 von DeepSeek veröffentlicht wurde.</strong> In der offiziellen Veröffentlichung sind zwei Varianten aufgeführt: DeepSeek V4-Pro und DeepSeek V4-Flash. V4-Pro hat 1,6T Gesamtparameter mit 49B pro Token aktiviert, während V4-Flash 284B Gesamtparameter mit 13B pro Token aktiviert hat. Beide unterstützen ein 1M-Token-Kontextfenster.</p>
<p>Die <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">DeepSeek V4-Pro Modellkarte</a> listet das Modell auch als MIT-lizenziert und verfügbar durch Hugging Face und ModelScope. Für Teams, die Dokumenten-Workflows mit langen Kontexten erstellen, liegt der Hauptvorteil in der Kostenkontrolle und der Flexibilität bei der Bereitstellung im Vergleich zu vollständig geschlossenen Grenz-APIs.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: Ein gehostetes Grenzmodell für Codierung, Forschung und Werkzeugnutzung</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>ist ein geschlossenes Grenzmodell, das von OpenAI am 23. April 2026 veröffentlicht wurde.</strong> OpenAI positioniert es für Codierung, Online-Recherche, Datenanalyse, Dokumentenarbeit, Tabellenkalkulation, Softwarebetrieb und toolbasierte Aufgaben. In der offiziellen Modelldokumentation wird <code translate="no">gpt-5.5</code> mit einem API-Kontextfenster mit 1 Mio. Token aufgeführt, während die Produktgrenzen von Codex und ChatGPT abweichen können.</p>
<p>OpenAI meldet starke Codierungs-Benchmark-Ergebnisse: 82,7 % auf Terminal-Bench 2.0, 73,1 % auf Expert-SWE und 58,6 % auf SWE-Bench Pro. Der Nachteil ist der Preis: In der offiziellen API-Preisliste wird GPT-5.5 mit $5 pro 1 Mio. Eingabe-Token und $30 pro 1 Mio. Ausgabe-Token angegeben, bevor produktspezifische oder Long-Context-Preisangaben gemacht werden.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: Ein kleineres Aktiv-Parameter-Modell für lokale und multimodale Workloads</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>ist ein MoE-Modell mit offenem Gewicht des Qwen-Teams von Alibaba.</strong> Seine Modellkarte enthält 35B Gesamtparameter, 3B aktivierte Parameter, einen Vision-Encoder und Apache-2.0-Lizenzierung. Es unterstützt ein natives Kontextfenster mit 262.144 Token und kann mit YaRN-Skalierung auf etwa 1.010.000 Token erweitert werden.</p>
<p>Das macht Qwen3.6-35B-A3B attraktiv, wenn lokale Bereitstellung, privates Serving, Bild-Text-Eingabe oder chinesischsprachige Workloads wichtiger sind als die Bequemlichkeit des verwalteten Grenzmodells.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs. GPT-5.5 vs. Qwen3.6: Modellspezifikationen im Vergleich</h3><table>
<thead>
<tr><th>Modell</th><th>Bereitstellungsmodell</th><th>Öffentliche Parameterinformationen</th><th>Kontext-Fenster</th><th>Stärkste Anpassung</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>Open-weight MoE; API verfügbar</td><td>1,6T insgesamt / 49B aktiv</td><td>1M Token</td><td>Langer Kontext, kostenbewusste technische Einsätze</td></tr>
<tr><td>GPT-5.5</td><td>Gehostetes geschlossenes Modell</td><td>Unveröffentlicht</td><td>1 Mio. Token in der API</td><td>Codierung, Live-Forschung, Tool-Nutzung und höchste Gesamtkapazität</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Multimodales MoE mit offenem Gewicht</td><td>35B insgesamt / 3B aktiv</td><td>262K nativ; ~1M mit YaRN</td><td>Lokaler/privater Einsatz, multimodale Eingabe und chinesischsprachige Szenarien</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">Wie wir DeepSeek V4, GPT-5.5 und Qwen3.6 getestet haben<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>Diese Tests sind kein Ersatz für vollständige Benchmark-Suiten. Es handelt sich um praktische Prüfungen, die häufige Fragen von Entwicklern widerspiegeln: Kann das Modell aktuelle Informationen abrufen, auf subtile Codefehler schließen und Fakten in einem sehr langen Dokument auffinden?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">Welches Modell bewältigt die Informationsbeschaffung in Echtzeit am besten?</h3><p>Wir haben jedem Modell drei zeitkritische Fragen gestellt und dabei, sofern verfügbar, eine Websuche verwendet. Die Anweisung war einfach: Geben Sie nur die Antwort zurück und fügen Sie die Quell-URL hinzu.</p>
<table>
<thead>
<tr><th>Frage</th><th>Erwartete Antwort zum Testzeitpunkt</th><th>Quelle</th></tr>
</thead>
<tbody>
<tr><td>Wie viel kostet es, ein 1024×1024 Bild mittlerer Qualität mit <code translate="no">gpt-image-2</code> über die OpenAI-API zu erzeugen?</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">Preise für OpenAI-Bilderzeugung</a></td></tr>
<tr><td>Welcher Song steht diese Woche auf Platz 1 der Billboard Hot 100, und wer ist der Künstler?</td><td><code translate="no">Choosin' Texas</code> von Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Billboard Hot 100-Hitparade</a></td></tr>
<tr><td>Wer führt derzeit die Rangliste der F1-Fahrer 2026 an?</td><td>Kimi Antonelli</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Formel-1-Fahrer-Rangliste</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Hinweis: Diese Fragen sind zeitabhängig. Die erwarteten Antworten spiegeln die Ergebnisse zum Zeitpunkt der Durchführung des Tests wider.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Die Bildpreis-Seite von OpenAI verwendet die Bezeichnung "medium" statt "standard" für das Ergebnis $0.053 1024×1024, daher ist die Frage hier normalisiert, um dem aktuellen API-Wortlaut zu entsprechen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Echtzeit-Abrufergebnisse: GPT-5.5 hatte den deutlichsten Vorteil</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro beantwortete die erste Frage falsch. Die zweite und dritte Frage konnte er in diesem Setup nicht über die Live-Websuche beantworten.</p>
<p>Die zweite Antwort enthielt die korrekte Billboard-URL, fand aber nicht den aktuellen Nummer-1-Song. Bei der dritten Antwort wurde die falsche Quelle verwendet, so dass wir sie als falsch gewertet haben.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 bewältigte diesen Test wesentlich besser. Seine Antworten waren kurz, genau, mit Quellenangabe und schnell. Wenn eine Aufgabe von aktuellen Informationen abhängt und das Modell über ein Live-Retrieval verfügt, war GPT-5.5 in dieser Situation klar im Vorteil.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B erzielte ein ähnliches Ergebnis wie DeepSeek V4-Pro. Es hatte in diesem Setup keinen Live-Web-Zugang, so dass es die Echtzeit-Abfrageaufgabe nicht erledigen konnte.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">Welches Modell eignet sich besser zum Debuggen von Gleichzeitigkeitsfehlern?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Im zweiten Test wurde ein Python-Banküberweisungsbeispiel mit drei Ebenen von Gleichzeitigkeitsproblemen verwendet. Die Aufgabe bestand nicht nur darin, die offensichtliche Race Condition zu finden, sondern auch zu erklären, warum der Gesamtsaldo nicht stimmt, und korrigierten Code bereitzustellen.</p>
<table>
<thead>
<tr><th>Schicht</th><th>Problem</th><th>Was läuft schief</th></tr>
</thead>
<tbody>
<tr><td>Grundlegend</td><td>Wettlaufbedingung</td><td><code translate="no">if self.balance &gt;= amount</code> und <code translate="no">self.balance -= amount</code> sind nicht atomar. Zwei Threads können gleichzeitig die Gleichgewichtsprüfung bestehen und dann beide Geld abziehen.</td></tr>
<tr><td>Mittel</td><td>Deadlock-Risiko</td><td>Eine naive Sperre pro Konto kann zu einem Deadlock führen, wenn die Übertragung A→B zuerst A sperrt, während die Übertragung B→A zuerst B sperrt. Dies ist die klassische ABBA-Sperre.</td></tr>
<tr><td>Erweitert</td><td>Falscher Sperrbereich</td><td>Wenn nur <code translate="no">self.balance</code> geschützt wird, ist <code translate="no">target.balance</code> nicht geschützt. Eine korrekte Lösung muss beide Konten in einer stabilen Reihenfolge sperren, normalerweise nach Konto-ID, oder eine globale Sperre mit geringerer Gleichzeitigkeit verwenden.</td></tr>
</tbody>
</table>
<p>Die Eingabeaufforderung und der Code sind wie unten dargestellt:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Code-Debugging-Ergebnisse: GPT-5.5 lieferte die vollständigste Antwort</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro lieferte eine knappe Analyse und ging direkt zur Lösung mit der bestellten Sperre über, die der Standardweg zur Vermeidung von ABBA-Sperren ist. Die Antwort zeigte die richtige Lösung, aber es wurde nicht viel Zeit darauf verwendet, zu erklären, warum die naive sperrbasierte Lösung einen neuen Fehlermodus einführen könnte.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 schnitt bei diesem Test am besten ab. Er fand die Kernprobleme, sah das Deadlock-Risiko voraus, erklärte, warum der ursprüngliche Code versagen könnte, und lieferte eine vollständige korrigierte Implementierung.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B identifizierte die Fehler genau, und die Beispiel-Ausführungssequenz war klar. Der schwächere Teil war die Korrektur: Es wählte eine globale Sperre auf Klassenebene, so dass alle Konten dieselbe Sperre teilen. Das funktioniert für eine kleine Simulation, ist aber ein schlechter Kompromiss für ein echtes Bankensystem, da nicht zusammenhängende Kontotransfers immer noch auf dieselbe Sperre warten müssen.</p>
<p><strong>Kurz gesagt:</strong> GPT-5.5 löste nicht nur den aktuellen Fehler, sondern warnte auch vor dem nächsten Fehler, den ein Entwickler einführen könnte. DeepSeek V4-Pro lieferte die sauberste Nicht-GPT-Lösung. Qwen3.6 fand die Probleme und produzierte funktionierenden Code, wies aber nicht auf den Kompromiss bei der Skalierbarkeit hin.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">Welches Modell eignet sich am besten für die Abfrage von langen Kontexten?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>Für den Test mit langem Kontext verwendeten wir den vollständigen Text von <em>Dream of the Red Chamber</em>, etwa 850.000 chinesische Zeichen. Wir fügten eine versteckte Markierung um die 500.000-Zeichen-Position ein:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>Dann luden wir die Datei in jedes Modell und baten es, sowohl den Inhalt der Markierung als auch ihre Position zu finden.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Ergebnisse der Suche nach langen Kontexten: GPT-5.5 fand die Markierung am genauesten</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro fand die versteckte Markierung, aber nicht die richtige Zeichenposition. Außerdem gab es den falschen Umgebungskontext an. In diesem Test schien es die Markierung semantisch zu lokalisieren, aber die genaue Position zu verlieren, während es das Dokument überprüfte.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 fand den Inhalt der Markierung, die Position und den umgebenden Kontext korrekt. Es meldete die Position als 500,002 und unterschied sogar zwischen null- und ein-indizierter Zählung. Der umgebende Kontext stimmte auch mit dem Text überein, der beim Einfügen der Markierung verwendet wurde.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B fand den Inhalt der Markierung und den umgebenden Kontext richtig, aber die Positionsschätzung war falsch.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">Was sagen diese Tests über die Modellauswahl aus?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Die drei Tests deuten auf ein praktisches Auswahlmuster hin: <strong>GPT-5.5 ist das Modell, das am besten zu den Fähigkeiten passt, DeepSeek V4-Pro ist das Modell mit der besten Kosten-Leistungs-Relation bei langem Kontext und Qwen3.6-35B-A3B ist das Modell mit der besten lokalen Kontrolle.</strong></p>
<table>
<thead>
<tr><th>Modell</th><th>Beste Passung</th><th>Was in unseren Tests geschah</th><th>Wichtigster Vorbehalt</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Beste Gesamtleistung</td><td>Gewann die Tests für Live-Abruf, Parallelitätstests und Marker für lange Kontexte</td><td>Höhere Kosten; am stärksten, wenn Genauigkeit und Werkzeugnutzung den Aufpreis rechtfertigen</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Langer Kontext, kostengünstigerer Einsatz</td><td>Bietet die stärkste Nicht-GPT-Behebung des Gleichzeitigkeitsfehlers und findet den Markierungsinhalt</td><td>Benötigt externe Retrieval-Tools für Live-Web-Aufgaben; die genaue Verfolgung der Zeichenposition war in diesem Test schwächer</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Lokaler Einsatz, offene Gewichte, multimodale Eingabe, chinesischsprachige Arbeitslasten</td><td>Gute Ergebnisse bei der Fehlererkennung und dem Verstehen von langen Kontexten</td><td>Die Qualität der Fehlerbehebung war weniger skalierbar; Live-Web-Zugriff war bei dieser Konfiguration nicht möglich</td></tr>
</tbody>
</table>
<p>Verwenden Sie GPT-5.5, wenn Sie das beste Ergebnis benötigen, und die Kosten zweitrangig sind. Verwenden Sie DeepSeek V4-Pro, wenn Sie einen langen Kontext, geringere Servicekosten und eine API-freundliche Bereitstellung benötigen. Verwenden Sie Qwen3.6-35B-A3B, wenn offene Gewichte, private Bereitstellung, multimodale Unterstützung oder Serving-Stack-Kontrolle am wichtigsten sind.</p>
<p>Für abruflastige Anwendungen ist die Wahl des Modells jedoch nur die halbe Miete. Selbst ein starkes Langkontextmodell schneidet besser ab, wenn der Kontext von einem speziellen <a href="https://zilliz.com/learn/generative-ai">semantischen Suchsystem</a> abgerufen, gefiltert und geerdet wird.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Warum RAG für Modelle mit langem Kontext immer noch von Bedeutung ist<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein langes Kontextfenster macht die Abfrage nicht überflüssig. Es ändert die Abfragestrategie.</p>
<p>In einer RAG-Anwendung sollte das Modell nicht jedes Dokument bei jeder Anfrage scannen. Eine <a href="https://zilliz.com/learn/introduction-to-unstructured-data">Vektordatenbank-Architektur</a> speichert Einbettungen, sucht nach semantisch relevanten Chunks, wendet Metadatenfilter an und gibt einen kompakten Kontextsatz an das Modell zurück. Dadurch erhält das Modell einen besseren Input und reduziert gleichzeitig Kosten und Latenzzeiten.</p>
<p>Milvus eignet sich für diese Aufgabe, da es <a href="https://milvus.io/docs/schema.md">Sammlungsschemata</a>, Vektorindizierung, skalare Metadaten und Abrufvorgänge in einem einzigen System abwickelt. Sie können lokal mit <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> beginnen, zu einem eigenständigen <a href="https://milvus.io/docs/quickstart.md">Milvus-Schnellstart</a> wechseln, mit einer <a href="https://milvus.io/docs/install_standalone-docker.md">Docker-Installation</a> oder <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose-Bereitstellung</a> bereitstellen und mit einer <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Kubernetes-Bereitstellung</a> weiter skalieren, wenn die Arbeitslast wächst.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Erstellen einer RAG-Pipeline mit Milvus und DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>In der folgenden Anleitung wird eine kleine RAG-Pipeline mit DeepSeek V4-Pro für die Generierung und Milvus für den Abruf erstellt. Die gleiche Struktur gilt für andere LLMs: Einbettungen erstellen, in einer Sammlung speichern, nach relevantem Kontext suchen und diesen Kontext an das Modell übergeben.</p>
<p>Eine ausführliche Anleitung finden Sie im offiziellen <a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus-RAG-Tutorial</a>. In diesem Beispiel wird die Pipeline klein gehalten, damit der Abruffluss leicht zu überprüfen ist.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Vorbereiten der Umgebung<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Installieren Sie die Abhängigkeiten</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie Google Colab verwenden, müssen Sie möglicherweise die Laufzeitumgebung nach der Installation der Abhängigkeiten neu starten. Klicken Sie auf das Menü <strong>Runtime</strong> und wählen Sie dann <strong>Restart session</strong>.</p>
<p>DeepSeek V4-Pro unterstützt eine OpenAI-ähnliche API. Melden Sie sich auf der offiziellen DeepSeek-Website an und setzen Sie <code translate="no">DEEPSEEK_API_KEY</code> als Umgebungsvariable.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Bereiten Sie den Milvus-Dokumentationsdatensatz vor</h3><p>Wir verwenden die FAQ-Seiten aus dem <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus 2.4.x Dokumentationsarchiv</a> als private Wissensquelle. Dies ist ein einfacher Startdatensatz für eine kleine RAG-Demo.</p>
<p>Laden Sie zunächst die ZIP-Datei herunter und entpacken Sie die Dokumentation in den Ordner <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Wir laden alle Markdown-Dateien aus dem Ordner <code translate="no">milvus_docs/en/faq</code>. Für jedes Dokument teilen wir den Inhalt der Datei durch <code translate="no">#</code> auf, was die wichtigsten Markdown-Abschnitte grob trennt.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Einrichten von DeepSeek V4 und des Einbettungsmodells</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Als nächstes wählen Sie ein Einbettungsmodell. In diesem Beispiel wird <code translate="no">DefaultEmbeddingFunction</code> aus dem PyMilvus-Modellmodul verwendet. Weitere Informationen zu <a href="https://milvus.io/docs/embeddings.md">Einbettungsfunktionen</a> finden Sie in den Milvus-Dokumenten.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Erzeugen Sie einen Testvektor und geben Sie dann die Dimension des Vektors und die ersten Elemente aus. Die zurückgegebene Dimension wird bei der Erstellung der Milvus-Sammlung verwendet.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Daten in Milvus laden<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Erstellen einer Milvus-Sammlung</h3><p>Eine Milvus-Sammlung speichert Vektorfelder, skalare Felder und optionale dynamische Metadaten. Die folgende Schnellkonfiguration verwendet die High-Level-API <code translate="no">MilvusClient</code>; für Produktionsschemata lesen Sie bitte die Dokumente zur <a href="https://milvus.io/docs/manage-collections.md">Sammlungsverwaltung</a> und zur <a href="https://milvus.io/docs/create-collection.md">Erstellung von Sammlungen</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Einige Hinweise zu <code translate="no">MilvusClient</code>:</p>
<ul>
<li>Die Einstellung von <code translate="no">uri</code> auf eine lokale Datei, z. B. <code translate="no">./milvus.db</code>, ist die einfachste Option, da sie automatisch <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> verwendet und alle Daten in dieser Datei speichert.</li>
<li>Wenn Sie einen großen Datensatz haben, können Sie einen Milvus-Server mit höherer Leistung auf <a href="https://milvus.io/docs/quickstart.md">Docker oder Kubernetes</a> einrichten. Bei dieser Einrichtung verwenden Sie die Server-URI, z. B. <code translate="no">http://localhost:19530</code>, als <code translate="no">uri</code>.</li>
<li>Wenn Sie <a href="https://docs.zilliz.com/">Zilliz Cloud</a>, den vollständig verwalteten Cloud-Dienst für Milvus, verwenden möchten, setzen Sie <code translate="no">uri</code> und <code translate="no">token</code> auf den <a href="https://docs.zilliz.com/docs/connect-to-cluster">öffentlichen Endpunkt und den API-Schlüssel</a> von Zilliz Cloud.</li>
</ul>
<p>Prüfen Sie, ob die Sammlung bereits existiert. Wenn ja, löschen Sie sie.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Erstellen Sie eine neue Sammlung mit den angegebenen Parametern. Wenn wir keine Feldinformationen angeben, erstellt Milvus automatisch ein Standardfeld <code translate="no">id</code> als Primärschlüssel und ein Vektorfeld zum Speichern von Vektordaten. Ein reserviertes JSON-Feld speichert skalare Daten, die nicht im Schema definiert sind.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Die Metrik <code translate="no">IP</code> steht für die Ähnlichkeit des inneren Produkts. Milvus unterstützt auch andere metrische Typen und Indexauswahlen, je nach Vektortyp und Arbeitslast; siehe die Leitfäden zu <a href="https://milvus.io/docs/id/metric.md">metrischen Typen</a> und <a href="https://milvus.io/docs/index_selection.md">Indexauswahl</a>. Die Einstellung <code translate="no">Strong</code> ist eine der verfügbaren <a href="https://milvus.io/docs/consistency.md">Konsistenzstufen</a>.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Einfügen der eingebetteten Dokumente</h3><p>Iterieren Sie durch die Textdaten, erstellen Sie Einbettungen und fügen Sie die Daten in Milvus ein. Hier fügen wir ein neues Feld namens <code translate="no">text</code> ein. Da es nicht explizit im Sammlungsschema definiert ist, wird es automatisch zum reservierten dynamischen JSON-Feld hinzugefügt. Für Produktionsmetadaten sehen Sie sich die <a href="https://milvus.io/docs/enable-dynamic-field.md">Unterstützung dynamischer Felder</a> und die <a href="https://milvus.io/docs/json-field-overview.md">JSON-Feldübersicht</a> an.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Für größere Datensätze kann dasselbe Muster mit explizitem Schemadesign, <a href="https://milvus.io/docs/index-vector-fields.md">Vektorfeldindizes</a>, skalaren Indizes und Datenlebenszyklusoperationen wie <a href="https://milvus.io/docs/insert-update-delete.md">Insert, Upsert und Delete</a> erweitert werden.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Aufbau des RAG Retrieval Flow<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Milvus nach relevantem Kontext durchsuchen</h3><p>Definieren wir eine allgemeine Frage über Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Durchsuchen Sie die Sammlung nach der Frage und rufen Sie die ersten drei semantischen Übereinstimmungen ab. Dies ist eine einfache <a href="https://milvus.io/docs/single-vector-search.md">Ein-Vektor-Suche</a>. In der Produktion können Sie sie mit der <a href="https://milvus.io/docs/filtered-search.md">gefilterten Suche</a>, der <a href="https://milvus.io/docs/full-text-search.md">Volltextsuche</a>, der <a href="https://milvus.io/docs/multi-vector-search.md">hybriden Suche mit mehreren Vektoren</a> und mit <a href="https://milvus.io/docs/reranking.md">Strategien zur</a> Verbesserung der Relevanz kombinieren.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Schauen wir uns nun die Suchergebnisse für die Abfrage an.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Generieren Sie eine RAG-Antwort mit DeepSeek V4</h3><p>Konvertieren Sie die abgerufenen Dokumente in ein String-Format.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Definieren Sie die System- und Benutzerabfragen für das LLM. Diese Eingabeaufforderung wird aus den von Milvus abgerufenen Dokumenten zusammengestellt.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verwenden Sie das von DeepSeek V4-Pro bereitgestellte Modell, um eine Antwort auf der Grundlage der Aufforderung zu generieren.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>An diesem Punkt hat die Pipeline die zentrale RAG-Schleife abgeschlossen: Dokumente einbetten, Vektoren in Milvus speichern, nach relevantem Kontext suchen und eine Antwort mit DeepSeek V4-Pro erzeugen.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">Was sollten Sie vor der Produktion verbessern?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Demo verwendet eine einfache Aufteilung von Abschnitten und eine Top-k-Suche. Das reicht aus, um die Mechanik zu zeigen, aber die Produktions-RAG benötigt in der Regel mehr Abrufkontrolle.</p>
<table>
<thead>
<tr><th>Die Produktion braucht</th><th>Zu berücksichtigende Milvus-Funktion</th><th>Warum es hilft</th></tr>
</thead>
<tbody>
<tr><td>Mischen von semantischen und Keyword-Signalen</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Hybride Suche mit Milvus</a></td><td>Kombiniert dichte Vektorsuche mit spärlichen oder Volltextsignalen</td></tr>
<tr><td>Zusammenführen von Ergebnissen aus mehreren Retrievern</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Milvus-Hybridsuche-Retriever</a></td><td>Ermöglicht LangChain-Workflows die Verwendung eines gewichteten oder RRF-ähnlichen Rankings</td></tr>
<tr><td>Einschränkung der Ergebnisse nach Tenant, Zeitstempel oder Dokumenttyp</td><td>Metadaten und skalare Filter</td><td>Hält den Abruf auf den richtigen Datenbereich beschränkt</td></tr>
<tr><td>Wechsel von selbstverwaltetem Milvus zu verwaltetem Service</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Migration von Milvus zu Zilliz</a></td><td>Reduziert den Infrastrukturaufwand bei gleichzeitiger Beibehaltung der Milvus-Kompatibilität</td></tr>
<tr><td>Sichere Anbindung gehosteter Anwendungen</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Zilliz Cloud API-Schlüssel</a></td><td>Bietet eine Token-basierte Zugangskontrolle für Anwendungsclients</td></tr>
</tbody>
</table>
<p>Die wichtigste Gewohnheit in der Produktion besteht darin, den Abruf getrennt von der Erzeugung zu bewerten. Wenn der abgerufene Kontext schwach ist, verdeckt der Austausch des LLM oft das Problem, anstatt es zu lösen.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Erste Schritte mit Milvus und DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie das Tutorial nachvollziehen wollen, beginnen Sie mit der offiziellen <a href="https://milvus.io/docs">Milvus-Dokumentation</a> und der <a href="https://milvus.io/docs/build-rag-with-milvus.md">Anleitung Build RAG with Milvus</a>. Für ein verwaltetes Setup <a href="https://docs.zilliz.com/docs/connect-to-cluster">verbinden</a> Sie <a href="https://docs.zilliz.com/docs/connect-to-cluster">sich mit</a> Ihrem Cluster-Endpunkt und API-Schlüssel <a href="https://docs.zilliz.com/docs/connect-to-cluster">mit der Zilliz Cloud</a>, anstatt Milvus lokal auszuführen.</p>
<p>Wenn Sie Hilfe bei der Optimierung von Chunking, Indizierung, Filtern oder hybrider Suche benötigen, werden Sie Mitglied der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> oder buchen Sie eine kostenlose <a href="https://milvus.io/office-hours">Milvus-Sprechstunde</a>. Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, verwenden Sie den <a href="https://cloud.zilliz.com/login">Zilliz-Cloud-Login</a> oder erstellen Sie ein <a href="https://cloud.zilliz.com/signup">Zilliz-Cloud-Konto</a>, um Milvus zu verwalten.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Fragen, die Entwickler über DeepSeek V4, Milvus und RAG stellen<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">Ist DeepSeek V4 gut für RAG?</h3><p>DeepSeek V4-Pro eignet sich hervorragend für RAG, wenn Sie eine lange Kontextverarbeitung und niedrigere Serving-Kosten als bei geschlossenen Premium-Modellen benötigen. Sie benötigen dennoch eine Abrufschicht wie Milvus, um relevante Chunks auszuwählen, Metadatenfilter anzuwenden und die Eingabeaufforderung zu fokussieren.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">Sollte ich GPT-5.5 oder DeepSeek V4 für eine RAG-Pipeline verwenden?</h3><p>Verwenden Sie GPT-5.5, wenn die Qualität der Antworten, die Verwendung von Tools und die Live-Recherche wichtiger sind als die Kosten. Verwenden Sie DeepSeek V4-Pro, wenn die Verarbeitung langer Kontexte und die Kostenkontrolle wichtiger sind, vor allem, wenn Ihre Abrufschicht bereits hochwertigen, geerdeten Kontext liefert.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Kann ich Qwen3.6-35B-A3B lokal für private RAG betreiben?</h3><p>Ja, Qwen3.6-35B-A3B ist offen und für einen kontrollierteren Einsatz konzipiert. Es ist ein guter Kandidat, wenn Datenschutz, lokale Bereitstellung, multimodale Eingaben oder Leistung in chinesischer Sprache wichtig sind, aber Sie müssen dennoch Latenz, Speicher und Abrufqualität für Ihre Hardware validieren.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">Machen Long-Context-Modelle Vektordatenbanken überflüssig?</h3><p>Nein. Modelle mit langem Kontext können mehr Text lesen, profitieren aber dennoch von der Abfrage. Eine Vektordatenbank grenzt die Eingabe auf relevante Abschnitte ein, unterstützt die Filterung von Metadaten, reduziert die Token-Kosten und erleichtert die Aktualisierung der Anwendung, wenn sich Dokumente ändern.</p>
