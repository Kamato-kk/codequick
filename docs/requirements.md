# 需求交付對照

日期：2026-11-16。此表的「已實作」表示檔案與邏輯存在，不代表已通過所有真實瀏覽器測試。

| 需求 | 狀態 | 交付／證據 |
| --- | --- | --- |
| 先規範再開發 | 已完成 | AGENTS.md 先於目錄與網站建立；擴充流程記錄於 agent-validation.md |
| 十項 AGENTS 規範及 Definition of Done | 已完成 | AGENTS.md |
| 原生技術、無後端與付費依賴 | 已完成 | index.html、assets/、data/ |
| 共用元件與內容分離 | 已完成 | ui.js、content.js、articles.json |
| 首頁、文章與關於頁 | 已實作 | app.js、ui.js |
| 搜尋、語言與難度篩選、無結果 | 已實作，邏輯測試通過 | test.mjs；畫面互動待測 |
| 複製、主題記憶、手機選單 | 已實作，瀏覽器待測 | ui.js、theme.js、app.js |
| 鍵盤與基本無障礙、響應式 | 已實作，瀏覽器待測 | semantic HTML、labels、CSS、焦點與選單事件 |
| 文章路由、重整、相關推薦 | 已實作，邏輯測試通過 | hash route 與 round-trip；瀏覽器重整待測 |
| 9 篇初始 + 1 篇函式 | 已完成 | data/articles.json，共 10 篇 |
| JSON Schema 及驗證 | 已完成 | Schema、validate.mjs；10 篇通過 |
| 程式範例執行 | 部分完成 | Python／JavaScript 6 PASS，C++ 4 SKIP |
| 擴充測試與原始文章保留 | 已完成自動驗證 | agent-validation.md，SHA-256 與搜尋／分類檢查 |
| README、部署說明、檔案結構 | 已完成 | README.md、deployment.md |
| Pages workflow 與相對路徑 | 已完成設定與本機 HTTP 檢查 | .github/workflows/pages.yml；遠端尚未執行 |
| 作業 Word 與 PDF | 已產生，PDF 已視覺檢查 | homework.docx／pdf；Word 渲染與轉 PDF 待補 |
| GitHub repository 與公開網站 | 待使用者確認授權後發布 | 尚無真實連結，不宣稱部署成功 |
| 最終兩個繳交檔 | 草稿備妥 | AGENTS.md + homework.pdf；須補發布連結與個人資料 |

所有自動實測與尚未執行的測試見 testing.md。課程最高評分還需要真實 GitHub 上傳及公開可瀏覽網頁，現階段不能宣稱已完整符合 9～10 分條件。
