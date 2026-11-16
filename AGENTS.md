# CodeQuick — AI 開發規範

## 1. Project Overview
CodeQuick（程式語法速查手冊）服務程式初學者、資工學生與需要查詢語法的開發者。使用 HTML5、CSS3、原生 JavaScript ES Modules 與 JSON，無後端、資料庫、API Key、執行期外部依賴。提供即時搜尋、語言／難度篩選、文章閱讀、相關文章、複製程式碼與主題切換。

## 2. Project Structure
```text
index.html                  # 唯一 HTML 入口；hash 路由避免 Pages 404
package.json                # 無依賴的指令捷徑
.gitignore                  # 排除暫存、輸出與憑證
assets/favicon.svg          # 本地向量網站圖示
assets/css/styles.css       # 設計 token、元件與響應式版型
assets/js/app.js            # 初始化、路由、UI 事件
assets/js/content.js        # 純函式：搜尋、篩選、相關推薦
assets/js/ui.js             # 安全 DOM 元件與文章版型
assets/js/theme.js          # 主題偏好與例外容錯
data/articles.json          # 唯一文章集合（新增文章只改此檔）
data/article.schema.json    # JSON Schema Draft 2020-12
scripts/validate.mjs         # 零依賴 Schema 子集及跨文章驗證
scripts/test.mjs             # 搜尋、分類、連結與安全規則測試
scripts/check-examples.py   # 實際執行各語言範例並核對輸出
scripts/serve.py            # 本機含 /codequick/ 子路徑預覽
scripts/build-homework.py   # 同來源產生作業 Word 與 PDF（非網站依賴）
.github/workflows/pages.yml # CI 驗證與 Pages artifact 部署
docs/agent-validation.md   # 擴充驗證的實際證據
docs/testing.md            # 實測紀錄及尚未測試項目
docs/requirements.md       # 全需求交付狀態對照
docs/deployment.md         # Pages 操作與回復
docs/homework.docx         # 作業說明 Word
docs/homework.pdf          # 作業說明 PDF
README.md
AGENTS.md
```
tmp/ 為忽略的驗證暫存，不屬於交付網站。
目錄及檔名一律小寫 kebab-case（AGENTS.md、README.md 除外）。不產生另一份文章 HTML，不把教學內容寫入 UI 模組。

## 3. Design System
預設深色：背景 #0b1020、表面 #141e33、文字 #edf2ff、次要文字 #aebbd4、主色 #78aaff；淺色：背景 #f4f7fc、表面 #ffffff、文字 #17253d、次要文字 #51627d、主色 #235dc2。用 CSS 自訂屬性集中管理。中文字用系統 sans-serif，程式碼用 Consolas/monospace。內文 16px、行高 1.7、標題 clamp(2rem,5vw,3.8rem)。間距使用 4/8/12/16/24/32/48/64px。卡片圓角 16px、1px 邊框；按鈕最小高度 44px。所有可互動元素有 focus-visible。斷點 640px（單欄／手機導覽）與 1000px（三欄）；程式碼獨立橫向捲動，不使頁面溢出。主題以 html data-theme 控制；localStorage 失敗不阻止操作。

## 4. Content Schema
以 data/article.schema.json 為唯一資料欄位契約。根為文章陣列。每篇必填 id、title、language、difficulty、category、summary、objectives、explanation、examples、notes、keywords、related。id 格式 ^(cpp|python|javascript)-[a-z0-9]+(-[a-z0-9]+)*$，必須與語言前綴相同且全域唯一。language 僅 cpp/python/javascript；difficulty 僅 beginner/intermediate；category 僅 basics/control-flow/collections/functions。陣列不得為空（related 可為空）。examples 每個物件含 title、code、output；code 必須是可獨立執行的完整程式，輸出不含提示符號。related 僅能填既有 ID，不可指向自己或重複。說明為純文字，不接受 HTML 或 Markdown。中文內容用繁體中文，避免機密與未查證的外部連結。

## 5. Development Rules
- HTML 使用 header/nav/main/footer、正確 heading 階層、lang=zh-Hant、skip link、具名 label。動態結果用 aria-live，行動選單同步 aria-expanded。路由變更後將焦點放到主標題。
- CSS 採具語意的 kebab-case 類名；顏色用 token，不新增 inline style。遵守 prefers-reduced-motion。
- JS 使用 ES Modules；content.js 不存取 DOM，ui.js 建立共用卡片與文章版型。禁止複製相同渲染邏輯。載入錯誤及未知 ID 顯示可恢復提示。
- 使用 createElement/textContent，不用 innerHTML、eval、第三方 CDN。網址 ID 經 URLSearchParams 解析；只以既有 ID 建立文章連結。複製失敗給使用者可操作的手動複製提示。
- localStorage 與 Clipboard API 都要 try/catch。不得以使用者輸入組成程式碼執行。

## 6. Adding New Content
1. 閱讀本檔、README.md、Schema、既有同語言文章和 content.js。
2. 在 articles.json 陣列新增物件，遵守欄位及完整可執行範例；不修改 HTML。
3. 新分類需同時新增 Schema 的 category enum 與 content.js 分類標籤；語言新種類需同步 Schema、前綴映射、標籤與範例執行器，屬架構變更須先說明。
4. 導覽語言與卡片由資料推導，不手動新增文章導覽項目。
5. 執行 node scripts/validate.mjs、node scripts/test.mjs、python scripts/check-examples.py。檢查首頁、搜尋及文章網址重新整理。

## 7. AI Agent Instructions
修改前先讀 AGENTS.md、README.md（若已存在）、Schema，並讀取要修改模組及其 import。先確認 git diff 或工作目錄，保留使用者既有修改。可改 assets/data/scripts/docs 與入口；新增內容通常只改 data/articles.json。不得自行改 ID、刪文章、放寬 Schema、加入框架、外部追蹤或付費依賴。規範或架構變更必須記錄理由並更新文件。不可在無證據下宣稱測試、執行範例或部署成功。不得自動推送、建立遠端 repo 或發布；先確認 GitHub 帳號、repo 名稱及操作授權。

## 8. Testing Checklist
- 自動：Schema 必填／型別／enum／pattern、重複 ID、失效 related、搜尋標題／摘要／關鍵字、兩種篩選組合、無結果、相關推薦、各 JS 語法、相對資源路徑、範例輸出。
- 瀏覽器：載入、卡片導航、文章重新整理、複製成功／失敗、主題儲存、鍵盤 Tab/Enter/Escape、手機選單、320/768/1440px 排版、長程式碼橫捲、無 console 錯誤。
- Pages：本機 /codequick/ 子路徑及 hash 路由；真實發布後檢查公開 URL、資源 200 及文章重新整理。未發布只能記為尚未驗證。
- 測試記錄放docs/testing.md；實際與未執行項目分列。不可只寫「全部通過」。

## 9. Deployment Rules
全部資源用 ./ 相對網址；文章用 #article=ID，不使用 /article/ 路由。不提交憑證、node_modules、暫存輸出。Pages workflow 在 main push 或手動觸發時先驗證再打包網站專用檔案；GitHub Settings → Pages → GitHub Actions。發布前執行所有自動測試及檢查差異，待使用者授權才操作遠端。公開成果未實測前不得宣稱部署完成。

## 10. Definition of Done
新文章：必填完整、範例輸出相符、ID 唯一、related 有效、搜尋／分類可找到、共用版型顯示。功能：規範一致、無 JS 語法錯、相關自動測試通過、無障礙與手機檢查有實測紀錄或明確限制、README 同步。部署：授權確認、Actions 成功、公開首頁與文章 URL 可讀，記錄真實 repo／網頁 URL。作業交付另含 Word 與 PDF，不用假網址冒充發布結果。
