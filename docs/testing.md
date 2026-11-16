# 測試結果與待測項目

日期：2026-11-16；本機 Windows、Node.js v24.19.0、Python 3.10.9。文件另使用 Codex bundled Python 3.12。

## 已實際執行

| 指令／檢查 | 結果 |
| --- | --- |
| `node scripts/validate.mjs` | PASS，10 篇；欄位型別、必填、enum、pattern、唯一 ID、related |
| `node scripts/test.mjs` | PASS，12 組，詳見下表 |
| `python scripts/check-examples.py` | 6 PASS（Python 3、JavaScript 3），4 SKIP（C++ 編譯器缺失） |
| Python ast.parse 檢查 scripts/*.py | 3 個腳本語法通過 |
| /codequick/ HTTP 預覽 | 首頁及 CSS、favicon、4 個 JS 模組、articles.json、Schema 共 9 個資源均 HTTP 200 且非空 |
| 原九篇 SHA-256 比對 | PASS，新增函式文章前後不變 |
| PDF 結構與文字 | 2 頁，文字可擷取，繁中文字體嵌入 |
| PDF 渲染 | Poppler 轉 PNG，逐頁檢視，未見缺字、裁切、重疊或溢出 |
| Word 結構 | python-docx 可重新開啟，共 27 段落 |

Node 完整測試中的子程序最初被沙箱 EPERM 阻擋；取得權限後才完成語法檢查與全部測試。最終測試在共用路由與跨平台路徑修正後重新執行並通過。

### 十二組自動測試

1. 原始九篇 ID 存在。
2. 標題搜尋。
3. 摘要搜尋。
4. 關鍵字、大小寫與前後空白處理。
5. 搜尋無結果。
6. 語言／難度交集與進階無內容。
7. 所有文章可由標題找到，hash URL 解析還原 ID。
8. 相關推薦有效、不含自身與重複。
9. 拒絕重複 ID、缺欄位、無效語言、失效／自指 related、未知欄位、空程式、語言前綴錯誤。
10. 所有網站 JS 模組通過 node --check，未使用 innerHTML 或 eval。
11. HTML 靜態資源為相對路徑且檔案存在。
12. 新增函式文章能搜尋並歸入 C++。

## 實作存在但尚未完成瀏覽器實測

Computer Use 的瀏覽器連線主機不可用；嘗試使用原生 Chrome 視窗時，工具無法可靠辨識目前網址，已停止此次 UI 操作。沒有以其他瀏覽器控制方法繞過限制。HTTP 200 只能證明資源可存取，不能證明畫面及互動正常。

待驗收：

- 桌機 1440px、平板 768px、手機 320px 與 390px 的版型及長程式碼橫捲。
- 搜尋輸入即時渲染、語言按鈕與難度選單、空結果清除按鈕。
- 全部卡片點擊、返回首頁、相關推薦及關於頁。
- 直接開啟 `#article=cpp-functions` 並重新整理後仍顯示同篇文章。
- 剪貼簿權限允許時的複製，以及拒絕時的選取文字和提示。
- 主題切換、重新整理後偏好保留，以及 localStorage 被封鎖時仍可切換。
- 手機選單展開／收合與 Escape 返回焦點。
- Tab／Shift+Tab／Enter、跳至內容、`/` 搜尋快捷鍵與螢幕閱讀器。
- 未知文章 ID、資料載入失敗及重新載入按鈕。
- 瀏覽器 console、Network 與實際對比／縮放檢查。

## 其他待辦與限制

- C++ 四篇需在具有 g++／clang++ 的環境執行 `python scripts/check-examples.py --require-all`。目前僅人工核對程式，尚未編譯。CI 已設定嚴格模式，尚未在 GitHub 執行。
- Word renderer 已實際嘗試，失敗原因 `LibreOffice soffice.exe was not found on PATH`。Word 原稿尚未完成版面渲染，不能聲稱其頁面已視覺驗證。
- 現有 PDF 與 Word 使用相同內容來源，PDF 是 ReportLab 另行排版，並非 Word 匯出。請補上姓名學號及真實發布連結後，由 Word 匯出最終繳交 PDF。
- 未建立／推送 GitHub repository，未執行遠端 Actions，未發布 Pages。正式 URL、公開資源與文章重整仍待發布後驗收。
