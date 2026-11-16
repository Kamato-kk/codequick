# CodeQuick 程式語法速查手冊

為初學者、資工學生與日常開發者提供繁體中文 C++、Python、JavaScript 速查教學。此專案是 Homework 9「建立自己的 AGENTS.md」成果：先建立規範，再依規範實作網站，最後以新增 C++ 函式文章驗證規則可重複使用。

目前有 **10 篇完整教學**。原始碼及部署設定已完成；**尚未上傳 GitHub、尚未公開部署**，不以範例網址表示已發布。繳交前必須補上真實 Repository 與 Pages 連結。

## 功能特色

- 即時搜尋標題、摘要與關鍵字，支援多字詞及大小寫容錯。
- 語言與難度交集篩選，無結果提示與清除條件。
- JSON 自動產生導覽、卡片、文章內容、分類標籤與相關推薦。
- 完整程式、預期輸出、注意事項及延伸閱讀。
- 一鍵複製，無剪貼簿權限時選取文字並提示手動複製。
- 預設深色、切換淺色，以 localStorage 記憶偏好。
- 響應式版型、行動選單、跳至內容、焦點樣式、鍵盤操作。
- `#article=cpp-functions` hash 網址可重新整理，適用 Pages 專案子路徑。

## 技術架構

HTML5 + CSS3 + Vanilla JavaScript ES Modules；教學內容儲存為 JSON，以 JSON Schema Draft 2020-12 描述契約。零執行期外部套件、無 API Key、無後端。Node.js 僅用於本機與 CI 測試，Python 僅用於預覽與範例驗證。一般使用者只需現代瀏覽器。

資料流程：`articles.json → app.js 載入 → content.js 搜尋／分類 → ui.js 共用版型 → DOM`。所有資料文字以 `textContent` 呈現，避免 HTML 注入。文章網址由 ID 產生，related 由驗證器檢查存在性。

## 檔案結構

```text
codequick/
├── AGENTS.md                       # AI 必讀開發契約
├── README.md
├── index.html                      # 唯一入口
├── package.json                    # 可選的 npm 指令捷徑，無依賴
├── assets/
│   ├── favicon.svg
│   ├── css/styles.css              # 設計系統、共用樣式、斷點
│   └── js/
│       ├── app.js                  # 資料載入、首頁、路由、互動
│       ├── content.js              # 純搜尋／推薦函式與顯示標籤
│       ├── ui.js                   # 卡片、文章、關於頁的安全 DOM
│       └── theme.js                # 主題及儲存容錯
├── data/
│   ├── articles.json               # 10 篇教學
│   └── article.schema.json
├── scripts/
│   ├── validate.mjs                # 本 Schema 所用關鍵字及跨文章規則
│   ├── test.mjs                    # 邏輯、語法、安全及路徑檢查
│   ├── check-examples.py           # 真正執行並比對輸出
│   ├── serve.py                    # /codequick/ 本機預覽
│   └── build-homework.py            # 作業文件產生器（需額外文件套件）
├── .github/workflows/pages.yml     # 驗證後才部署
└── docs/
    ├── agent-validation.md         # 9 → 10 篇擴充實測
    ├── testing.md                  # 實測、限制與待測清單
    ├── requirements.md             # 全需求交付狀態對照
    ├── deployment.md               # 部署及回復步驟
    ├── homework.docx               # 可編輯作業說明
    └── homework.pdf                # 作業說明 PDF
```

## 本機啟動

安裝 Python 3.10 以上，於專案目錄執行：

```sh
python scripts/serve.py
```

開啟 **http://127.0.0.1:8000/codequick/**。停止使用 Ctrl+C。請勿直接雙擊 index.html；`file://` 無法正常 fetch JSON 與載入 ES Modules。若 8000 已被占用，先停止占用該埠的程式或修改 serve.py 的埠號。

鍵盤可用 Tab／Shift+Tab 移動、Enter 啟動連結與按鈕；首頁按 `/` 聚焦搜尋，Escape 關閉行動選單。程式碼區塊可聚焦並左右捲動。

## 新增文章與 AI 工作流程

1. AI 先讀 AGENTS.md、本文、data/article.schema.json 與同語言既有文章。
2. 在 data/articles.json 陣列新增一個物件；所有必填欄位照 Schema。ID 例如 `python-dictionaries`，不得重複，語言前綴須一致。
3. 使用既有 category；新增分類時同步 Schema enum 與 content.js 的 categoryLabels。新增語言屬架構變更，需要同步 enum、ID pattern、標籤與範例執行器。
4. examples 的 code 寫完整可執行程式（C++ 含 main 和 include），output 寫真實標準輸出。related 填既有文章 ID。
5. 執行下方測試，確認搜尋、篩選及文章網址；**不需複製 HTML、增加路由或修改文章版型**。
6. 在 docs/testing.md 記錄真實結果；未執行項目必須列明。

可給 AI 的任務：

> 先閱讀 AGENTS.md、README.md 及 Schema，依既有格式新增 Python 字典教學。只在必要檔案修改，執行資料、搜尋、連結和範例測試，回報實際結果與限制。

規範實測見 [agent-validation.md](docs/agent-validation.md)。目前資料只含入門文章；進階篩選的空結果是預期行為。

## 測試方式

安裝 Node.js 24 以上（無需 npm install），執行：

```sh
node scripts/validate.mjs
node scripts/test.mjs
python scripts/check-examples.py
```

或 `npm test` 執行前兩項。C++ 範例需要 PATH 中有 g++ 或 clang++，依 C++17 編譯。缺編譯器時腳本明確列 SKIP，不能視為編譯成功。CI 使用：

```sh
python scripts/check-examples.py --require-all
```

`--require-all` 在任一語言缺執行環境時以非零碼結束。GitHub Ubuntu runner 應提供 g++；若沒有，需安裝後重跑，不得繞過檢查。驗證器是零依賴、針對目前 Schema 使用的 type/required/properties/additionalProperties/enum/pattern/minLength/minItems/uniqueItems 實作，並非通用 JSON Schema 引擎。若新增其他 Schema 關鍵字，必須擴充驗證器與反例測試。

瀏覽器實測清單及本次結果見 [testing.md](docs/testing.md)。自動測試無法替代真實手機、剪貼簿與螢幕閱讀器驗證。

## GitHub Pages 部署

完整步驟見 [deployment.md](docs/deployment.md)。概要：確認 GitHub 帳號及 repo `codequick` → 建立公開 repository → 上傳全部原始碼至 main → Settings / Pages 選 GitHub Actions → 檢查 Validate and deploy CodeQuick。workflow 只發布 index.html、assets、data，作業文件不打包至公開網站。

預期格式為 `https://USERNAME.github.io/codequick/`，USERNAME 必須替換成真實帳號；此處是格式範例。由 Actions 回傳的真實 URL 為準。上傳或發布前，AI 必須先取得帳號、repo 名稱及操作授權。

## 後續擴充

可新增進階教學、字典／物件、函式與錯誤處理。更多內容時可將集合拆檔並使用 manifest，但須保留單一 Schema 及跨文章驗證。可再加入書籤、閱讀進度或離線快取；引入功能前先更新 AGENTS.md 與測試，不需要先導入大型框架。

## 作業繳交

依課程要求繳交 **docs/homework.pdf 與 AGENTS.md 兩個檔案**。Word 原始檔供補上姓名、學號、真實 Repository 與 Pages 連結後修訂使用。發布完成後更新作業文件並確認 PDF 內連結能點選，才符合已上傳 GitHub 且有公開網頁的完整條件。

### 作業文件產生限制

`python scripts/build-homework.py` 需 python-docx、reportlab 與 Windows Microsoft JhengHei 字體；這些只是文件產生工具，網站及測試不需它們。現有 PDF 與 Word 使用相同內容來源，但 PDF 是另行排版產生，並非 Word 匯出。PDF 兩頁已渲染並檢視；環境缺少 LibreOffice，Word 版面尚未完成渲染驗證。請於 Word 補齊個人資料與發布連結後，匯出最終繳交 PDF。

完整交付狀態請見 [需求對照](docs/requirements.md)。
