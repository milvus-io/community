---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >-
  Schritt-für-Schritt-Anleitung zur Einrichtung von OpenClaw (zuvor
  Clawdbot/Moltbot) mit Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  Schritt-für-Schritt-Anleitung zur Einrichtung von OpenClaw mit Slack. Führen
  Sie einen selbst gehosteten KI-Assistenten auf Ihrem Mac oder Linux-Rechner
  aus - keine Cloud erforderlich.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>Wenn Sie diese Woche auf Tech-Twitter, Hacker News oder Discord waren, haben Sie es gesehen. Ein Hummer-Emoji 🦞, Screenshots von erledigten Aufgaben und eine kühne Behauptung: eine KI, die nicht nur <em>redet - sie</em> <em>tut es</em> tatsächlich.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Am Wochenende wurde es noch verrückter. Der Unternehmer Matt Schlicht hat <a href="https://moltbook.com">Moltbook</a>ins Leben gerufen <a href="https://moltbook.com">- ein</a>soziales Netzwerk im Stil von Reddit, in dem nur KI-Agenten posten können und Menschen nur zuschauen können. Innerhalb weniger Tage meldeten sich über 1,5 Millionen Agenten an. Sie bildeten Gemeinschaften, diskutierten über Philosophie, beschwerten sich über ihre menschlichen Betreiber und gründeten sogar ihre eigene Religion namens "Crustafarianism". Ja, wirklich.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Willkommen beim OpenClaw-Wahn.</p>
<p>Der Hype ist so real, dass die Aktien von Cloudflare um 14 % gestiegen sind, nur weil Entwickler die Infrastruktur von Cloudflare zur Ausführung von Anwendungen nutzen. Die Mac Mini-Verkäufe sind Berichten zufolge in die Höhe geschnellt, weil die Leute spezielle Hardware für ihren neuen KI-Mitarbeiter kaufen. Und das GitHub-Repositorium? Über <a href="https://github.com/openclaw/openclaw">150.000 Sterne</a> in nur wenigen Wochen.</p>
<p>Deshalb mussten wir Ihnen natürlich zeigen, wie Sie Ihre eigene OpenClaw-Instanz einrichten - und sie mit Slack verbinden, damit Sie Ihren KI-Assistenten von Ihrer bevorzugten Messaging-App aus steuern können.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">Was ist OpenClaw?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (früher bekannt als Clawdbot/Moltbot) ist ein quelloffener, autonomer KI-Agent, der lokal auf den Rechnern der Benutzer läuft und reale Aufgaben über Messaging-Apps wie WhatsApp, Telegram und Discord ausführt. Er automatisiert digitale Arbeitsabläufe - wie die Verwaltung von E-Mails, das Surfen im Internet oder die Planung von Meetings - indem er sich mit LLMs wie Claude oder ChatGPT verbindet.</p>
<p>Kurz gesagt, es ist, als hätte man einen digitalen Assistenten, der 24 Stunden am Tag, 7 Tage die Woche denkt, antwortet und tatsächlich etwas zustande bringt.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Einrichten von OpenClaw als KI-Assistent auf Slack-Basis<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Stellen Sie sich vor, Sie hätten einen Bot in Ihrem Slack-Arbeitsbereich, der sofort Fragen zu Ihrem Produkt beantworten, bei der Behebung von Benutzerproblemen helfen oder Teammitglieder auf die richtige Dokumentation verweisen kann - ohne dass jemand seine Arbeit unterbrechen muss. Für uns könnte das einen schnelleren Support für die Milvus-Community bedeuten: ein Bot, der häufige Fragen beantwortet ("Wie erstelle ich eine Sammlung?"), bei der Fehlersuche hilft oder bei Bedarf Versionshinweise zusammenfasst. Für Ihr Team könnte es das Onboarding neuer Ingenieure, die Bearbeitung interner FAQs oder die Automatisierung sich wiederholender DevOps-Aufgaben sein. Die Anwendungsfälle sind vielfältig.</p>
<p>In diesem Tutorial gehen wir die Grundlagen durch: Installieren Sie OpenClaw auf Ihrem Rechner und verbinden Sie es mit Slack. Danach haben Sie einen funktionierenden KI-Assistenten, den Sie an Ihre Bedürfnisse anpassen können.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><ul>
<li><p>Ein Mac- oder Linux-Rechner</p></li>
<li><p>Ein <a href="https://console.anthropic.com/">Anthropic-API-Schlüssel</a> (oder Claude Code CLI-Zugang)</p></li>
<li><p>Ein Slack-Arbeitsbereich, in dem du Apps installieren kannst</p></li>
</ul>
<p>Das war's schon. Fangen wir an.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Schritt 1: OpenClaw installieren</h3><p>Führen Sie das Installationsprogramm aus:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn Sie dazu aufgefordert werden, wählen Sie <strong>Ja</strong>, um fortzufahren.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wählen Sie dann den <strong>QuickStart-Modus</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Schritt 2: Wählen Sie Ihr LLM</h3><p>Das Installationsprogramm wird Sie auffordern, einen Modellanbieter auszuwählen. Wir verwenden Anthropic mit dem Claude Code CLI für die Authentifizierung.</p>
<ol>
<li>Wählen Sie <strong>Anthropic</strong> als Anbieter  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Schließen Sie die Verifizierung in Ihrem Browser ab, wenn Sie dazu aufgefordert werden.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Wählen Sie <strong>anthropic/claude-opus-4-5-20251101</strong> als Ihr Standardmodell  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Schritt 3: Slack einrichten</h3><p>Wenn Sie aufgefordert werden, einen Kanal auszuwählen, wählen Sie <strong>Slack.</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Benennen Sie nun Ihren Bot. Wir haben unseren "Clawdbot_Milvus" genannt.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nun müssen Sie eine Slack-App erstellen und zwei Token besorgen. So geht's:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Eine Slack-App erstellen</strong></p>
<p>Rufen Sie die <a href="https://api.slack.com/apps?new_app=1">Slack-API-Website</a> auf und erstellen Sie eine neue App von Grund auf.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Geben Sie ihr einen Namen und wählen Sie den Arbeitsbereich, den Sie verwenden möchten.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Bot-Berechtigungen festlegen</strong></p>
<p>Klicken Sie in der Seitenleiste auf <strong>OAuth &amp; Permissions</strong>. Scrollen Sie nach unten zu <strong>Bot Token Scopes</strong> und fügen Sie die Berechtigungen hinzu, die Ihr Bot benötigt.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Aktivieren Sie den Socket-Modus</strong></p>
<p>Klicken Sie in der Seitenleiste auf <strong>Socket-Modus</strong> und schalten Sie ihn ein.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dadurch wird ein <strong>App-Level-Token</strong> generiert (beginnt mit <code translate="no">xapp-</code>). Kopieren Sie es an einen sicheren Ort.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Aktivieren Sie Ereignisabonnements</strong></p>
<p>Gehen Sie zu <strong>Ereignisabonnements</strong> und schalten Sie es ein.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wählen Sie dann die Ereignisse aus, die Ihr Bot abonnieren soll.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Installieren Sie die App</strong></p>
<p>Klicken Sie in der Seitenleiste auf <strong>App installieren</strong> und dann <strong>auf Installieren anfordern</strong> (oder installieren Sie direkt, wenn Sie ein Arbeitsbereich-Administrator sind).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nach der Genehmigung sehen Sie Ihr <strong>Bot User OAuth Token</strong> (beginnt mit <code translate="no">xoxb-</code>). Kopieren Sie auch dieses.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Schritt 4: Konfigurieren Sie OpenClaw</h3><p>Zurück in der OpenClaw CLI:</p>
<ol>
<li><p>Geben Sie Ihr <strong>Bot User OAuth Token</strong> ein (<code translate="no">xoxb-...</code>)</p></li>
<li><p>Geben Sie Ihr <strong>App-Level Token</strong> ein (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Wählen Sie, auf welche Slack-Kanäle der Bot zugreifen kann  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Überspringen Sie die Konfiguration der Skills für den Moment - Sie können sie später jederzeit hinzufügen  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Wählen Sie <strong>Neustart</strong>, um Ihre Änderungen zu übernehmen.</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Schritt 5: Probieren Sie es aus</h3><p>Gehen Sie zu Slack und senden Sie Ihrem Bot eine Nachricht. Wenn alles richtig eingerichtet ist, wird OpenClaw antworten und bereit sein, Aufgaben auf Ihrem Computer auszuführen.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Tipps</h3><ol>
<li>Führen Sie <code translate="no">clawdbot dashboard</code> aus, um die Einstellungen über eine Weboberfläche zu verwalten.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Wenn etwas schief geht, prüfen Sie die Protokolle auf Fehlerdetails  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">Ein Wort der Warnung<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw ist mächtig - und genau deshalb sollten Sie vorsichtig sein. "Tatsächlich Dinge tun" bedeutet, dass es echte Befehle auf Ihrem Rechner ausführen kann. Das ist der Sinn der Sache, aber es birgt auch Risiken.</p>
<p><strong>Die gute Nachricht:</strong></p>
<ul>
<li><p>Es ist quelloffen, also ist der Code überprüfbar.</p></li>
<li><p>Es wird lokal ausgeführt, so dass Ihre Daten nicht auf einem fremden Server liegen.</p></li>
<li><p>Sie bestimmen, welche Berechtigungen es hat.</p></li>
</ul>
<p><strong>Die nicht so gute Nachricht:</strong></p>
<ul>
<li><p>Prompt Injection ist ein echtes Risiko - eine bösartige Nachricht könnte den Bot dazu verleiten, unbeabsichtigte Befehle auszuführen.</p></li>
<li><p>Betrüger haben bereits gefälschte OpenClaw-Repos und Token erstellt, also seien Sie vorsichtig, was Sie herunterladen</p></li>
</ul>
<p><strong>Unser Ratschlag:</strong></p>
<ul>
<li><p>Führen Sie den Bot nicht auf Ihrem Hauptrechner aus. Verwenden Sie eine VM, einen Ersatzlaptop oder einen dedizierten Server.</p></li>
<li><p>Gewähren Sie nicht mehr Berechtigungen als nötig.</p></li>
<li><p>Verwenden Sie es noch nicht in der Produktion. Es ist neu. Behandeln Sie es als das Experiment, das es ist.</p></li>
<li><p>Halten Sie sich an die offiziellen Quellen: <a href="https://x.com/openclaw">@openclaw</a> auf X und <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Sobald Sie einem LLM die Möglichkeit geben, Befehle auszuführen, gibt es keine 100%ige Sicherheit mehr. Das ist kein Problem von OpenClaw, sondern liegt in der Natur der agentenbasierten KI. Gehen Sie einfach klug damit um.</p>
<h2 id="Whats-Next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Herzlichen Glückwunsch! Sie haben jetzt einen lokalen KI-Assistenten, der auf Ihrer eigenen Infrastruktur läuft und über Slack erreichbar ist. Ihre Daten gehören weiterhin Ihnen, und Sie haben einen unermüdlichen Helfer, der bereit ist, die sich wiederholenden Aufgaben zu automatisieren.</p>
<p>Von hier aus können Sie:</p>
<ul>
<li><p>Weitere <a href="https://docs.molt.bot/skills">Skills</a> installieren, um die Möglichkeiten von OpenClaw zu erweitern</p></li>
<li><p>Geplante Aufgaben einrichten, damit es proaktiv arbeitet</p></li>
<li><p>Andere Messaging-Plattformen wie Telegram oder Discord verbinden</p></li>
<li><p>das <a href="https://milvus.io/">Milvus-Ökosystem</a> für KI-Suchfunktionen erforschen</p></li>
</ul>
<p><strong>Haben Sie Fragen oder möchten Sie uns mitteilen, was Sie entwickeln?</strong></p>
<ul>
<li><p>Treten Sie der <a href="https://milvus.io/slack">Milvus-Slack-Community</a> bei, um sich mit anderen Entwicklern auszutauschen.</p></li>
<li><p>Buchen Sie unsere <a href="https://milvus.io/office-hours">Milvus Office Hours</a> für Live-Fragen und Antworten mit dem Team</p></li>
</ul>
<p>Viel Spaß beim Hacken! 🦞</p>
