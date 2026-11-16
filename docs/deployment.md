# GitHub Pages 部署操作

## 發布狀態

目前未建立遠端儲存庫、未推送、未部署。先確認 GitHub 帳號、儲存庫名稱（建議 codequick）及建立／推送／公開發布授權。作業必須有真實公開連結才符合完整繳交條件。

## 部署前

1. 執行 `node scripts/validate.mjs`、`node scripts/test.mjs`。
2. 執行 `python scripts/check-examples.py --require-all`，本機缺 C++ 編譯器時需另裝或交由 CI 驗證；不得將 SKIP 當通過。
3. 以 `python scripts/serve.py` 開啟 `/codequick/`，檢查首頁、搜尋、主題、手機與文章重新整理。
4. 確認不含密鑰、個資、tmp/ 或 node_modules；檢查所有差異。

## 首次上傳

在 GitHub 建立名為 `codequick` 的公開 repository（免費方案可用公開 repository 發布 Pages）。若要用以下 Git 指令，先安裝 Git、登入並確認授權，且遠端應為空 repo：

```sh
git init
git add .
git commit -m "Create CodeQuick with agent guidelines and verified content"
git branch -M main
git remote add origin https://github.com/USERNAME/codequick.git
git push -u origin main
```

USERNAME 必須改成實際帳號。若已有 Git 歷史或 origin，先檢查 `git status` 與 `git remote -v`，不可直接覆蓋或 force push。沒有 Git 也可以在 GitHub 網頁上傳檔案，請保留 `.github/workflows/pages.yml` 的資料夾層級。

## 啟用 Pages

1. Repository → Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。
2. Actions → **Validate and deploy CodeQuick** → Run workflow，分支選 main。也可透過 main 的 push 觸發。
3. validate 工作會先做資料／邏輯／語法檢查及全部範例實際執行，再只打包 index.html、assets 與 data。
4. deploy 需要前項成功，使用 github-pages environment 與 pages/write、id-token/write 權限發布。
5. 到 Actions 部署結果取得真實 URL。預期形式 `https://USERNAME.github.io/codequick/`。
6. 開啟首頁及 `#article=cpp-functions`，直接重新整理，確認 CSS、JS、JSON 均載入。把真實 Repository URL 與網站 URL 填入作業 Word，再更新 PDF。

本專案用相對資源路徑及 hash 文章路由，不需要 SPA 404.html 轉址。不可改為 `/assets/...` 或 `/data/...`，否則專案子路徑會失效。不要選 docs 資料夾作發布來源，它是作業與技術文件，並非網站輸出。

## 維護與回復

一般更新後先本機驗證，再 commit/push，Actions 自動重新驗證。Pull Request 只驗證，不部署。失敗時查看 validate 或 deploy 的日誌；若 C++ 環境缺失，提供 g++ 再跑，不能移除 require-all。若 Pages 尚未啟用，先選 GitHub Actions 再重跑。復原使用 revert 建立反向提交並重新驗證，不使用 force push 刪歷史。

## 官方參考

部署設定依據 [GitHub 自訂 Pages workflow 文件](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) 與 [發布來源設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)，查閱日期 2026-11-16。設定已備妥；真正的 GitHub Actions 運行與公開 URL 尚未驗證。
