# AGENTS.md 可擴充性驗證紀錄

日期：2026-11-16（Asia/Taipei）

## 任務與執行順序

測試任務：「依照 AGENTS.md 新增一篇 C++ 函式基礎教學。」

1. 在空白工作目錄先寫 AGENTS.md，才建立目錄與網站檔案。
2. 依規範先做共用樣式、卡片及閱讀版型，再建立 Schema 與原始九篇 JSON 教學。
3. 完成網站互動後，對九篇執行資料驗證及 11 組測試。第一次 Node 子程序語法檢查因沙箱 EPERM 中斷，取得執行權限後完整通過；不是把失敗次數當成成功。
4. 擴充前重新讀取 AGENTS.md，檢查 Schema 及既有 C++ 文章；以排序鍵的 JSON 序列化物件計算原九篇 SHA-256 指紋。
5. 只在 data/articles.json 陣列加入 cpp-functions，標題「函式基礎」、language=cpp、difficulty=beginner、category=functions。範例使用 add(int, int)，預期輸出 7 與 15，related 指向原有變數與條件文章。
6. 執行 Schema、搜尋、分類、ID／連結與原始物件比對；未為新文章新增 HTML、JS 分支或路由。
7. 最終階段另外修正通用 skip link 初始路由與測試路徑處理，並將 AGENTS.md 的分類標籤模組名稱從 ui.js 校正為實際的 content.js。這些為共用維護修正，不是顯示第十篇所需的特殊處理。

## 實際結果

| 項目 | 結果與證據 |
| --- | --- |
| Schema 必填、型別、enum、pattern | `node scripts/validate.mjs`：PASS，10 篇 |
| 唯一 ID 與 related 完整性 | 驗證通過，無重複、失效或自指關聯 |
| 搜尋「函式」且語言 cpp | 純函式測試找到唯一 cpp-functions |
| 語言篩選 | cpp 有 4 篇，python 與 javascript 各 3 篇；篩選測試通過 |
| 全部文章網址 | ID → hash → URLSearchParams 解析 round-trip 通過 |
| 原九篇內容 | 每個物件 SHA-256 與新增前相同，且存在性測試通過 |
| 共用版型 | 原始碼檢查：renderArticle 使用資料物件，無 cpp-functions 特例；未新增文章 HTML |
| JSON 可由網站載入 | `/codequick/data/articles.json` HTTP 200，包含 10 篇 |
| C++ 範例實際執行 | **未執行**：本機缺 g++／clang++，不能宣稱輸出已經編譯核對 |
| 瀏覽器看到第十篇、點選與重新整理 | **尚未實測**：Computer Use 無法可靠辨識 Windows 瀏覽器網址而停止 |

結論：資料契約、搜尋／分類邏輯與沿用共用模板的擴充流程已通過實際自動測試；網站視覺與互動端仍需瀏覽器驗收。相關測試為完整 12 組，並非 12 個瀏覽器端測試。

## 原始九篇指紋

下列 SHA-256 使用 Python `json.dumps(article, ensure_ascii=False, sort_keys=True).encode()`，在新增前保存並在新增後逐篇比對。供稽核本次擴充使用，不限制日後依需求修訂教學。

```json
{
  "cpp-variables": "983f890362b57609c442929e6045d3b808deebbc4cd0b744dbb545bee62416aa",
  "cpp-conditions": "5180df1f6a928a4805f5d52f23875837752de3a1a10e286e97950a84bd1d263c",
  "cpp-loops": "310f1ad76ecb9a5f97116b62d398d9b7c2e12828c4d2fb9572c461c7ce3ea6a4",
  "python-variables": "2c850dc76ca3d401738d070a1539275b605615adf4448ded7d7b4283db6a926d",
  "python-conditions": "85fb185d851730104ab5003f71f2a891edd0a2aec7dd11c2983bfbeababf7aaf",
  "python-lists": "b6dead013e926b16984f59efeea1cf014512b08c3989a2e307515ebdaff8ce13",
  "javascript-variables": "22e54a053ba710902daa153a38d3259b7d0f70daa882aa76480a267de44b38ee",
  "javascript-conditions": "ab50ea9a76c34f0a52989c1431e0ab355f40b467bd556a64c87a2dfdbb038a08",
  "javascript-arrays": "4ae510c0be39c3c4628e376256c62e2f260017ce9c615d4df0087ed4c89cf5fa"
}
```
