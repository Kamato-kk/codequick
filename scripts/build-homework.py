"""以相同內容來源建立作業說明 Word 與 PDF。
需 python-docx、reportlab。PDF 為相同內容另行排版；有 Word 時請用 Word 匯出最終繳交版。
"""
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.colors import HexColor
from xml.sax.saxutils import escape
root=Path(__file__).resolve().parent.parent
pages=[[
('title','CodeQuick 程式語法速查手冊'),
('subtitle','Homework 9 建立可延伸的 AGENTS.md 專案'),
('body','製作日期：2026 年 11 月 16 日　｜　姓名及學號：繳交前填入'),
('heading','專案簡介'),
('body','CodeQuick 是提供程式初學者、資訊工程學生與開發者使用的繁體中文語法速查網站，涵蓋 C++、Python 與 JavaScript。本作業先建立 AGENTS.md，再依規範完成網站，並透過新增第十篇教學驗證規則的可重複使用性。'),
('heading','成果與公開連結'),
('body','GitHub Repository：尚未建立或上傳，待確認帳號及操作授權後填入真實連結。'),
('body','公開網頁：尚未部署。預期格式為 https://USERNAME.github.io/codequick/，此格式不是已發布成果。'),
('body','本機預覽：執行 python scripts/serve.py，開啟 http://127.0.0.1:8000/codequick/。'),
('heading','功能與技術架構'),
('body','網站提供標題、摘要與關鍵字搜尋，語言及難度篩選、文章閱讀、程式碼複製、深淺色切換與主題記憶、手機導覽和相關推薦。十篇文章均包含目標、說明、完整程式、輸出與注意事項。'),
('body','採 HTML5、CSS3、原生 JavaScript ES Modules 與 JSON，無後端、資料庫或 API Key。文章以 hash 網址識別，重新整理不需要伺服器路由，適合 GitHub Pages 專案子路徑。'),
('heading','規範如何對應程式碼'),
('body','AGENTS.md 定義目的、目錄、設計系統、Schema、開發與安全規則、AI 工作流程、測試、部署及完成標準。data/articles.json 儲存內容；article.schema.json 定義契約；content.js 處理搜尋與推薦；ui.js 提供共用卡片與閱讀版型；app.js 負責載入與路由。'),
],[
('title','規範驗證與後續延伸'),
('heading','依照規範新增內容的流程'),
('body','AI 先閱讀 AGENTS.md、README.md、Schema 與同語言範例，再於 articles.json 新增符合格式且 ID 唯一的物件。填寫完整可執行程式、實際輸出與有效 related ID，執行驗證後檢查搜尋、分類及文章網址。新增文章不需複製 HTML 或建立另一份版型。'),
('body','若加入新分類，同步 Schema enum 與 content.js 的分類標籤；若新增語言，則先說明架構變更並更新語言、ID 前綴與範例執行器。這些具體規則能讓後續 AI 採相同方式擴充，而非每次重建網站。'),
('heading','C++ 函式基礎擴充實測'),
('body','初始九篇文章完成後，重新閱讀 AGENTS.md，新增 cpp-functions。只增加一筆 JSON 資料，沿用原有版型與路由。Schema、唯一 ID、關聯連結、函式搜尋及 C++ 分類測試通過；原九篇物件以 SHA-256 比對，內容未變。過程記錄於 docs/agent-validation.md。'),
('heading','實際測試與限制'),
('body','Node.js 自動測試十二組通過，包含搜尋、分類、無結果、連結、錯誤資料拒絕、JavaScript 語法與相對資源檢查。Python 與 JavaScript 六個範例實際執行並符合預期輸出。本機 /codequick/ 首頁 HTTP 200。'),
('body','本機沒有 C++ 編譯器，四個 C++ 範例未實際編譯。瀏覽器工具無法可靠辨識 Windows 網址，已停止 UI 操作，因此手機排版、剪貼簿、主題儲存及完整鍵盤互動尚未實測。GitHub Actions 與公開網站也尚未執行驗證。不得把上述項目寫成測試成功。'),
('heading','部署與繳交前待辦'),
('body','確認 GitHub 帳號、repo 名稱與公開操作授權後，上傳 main，於 Settings 的 Pages 選 GitHub Actions，再檢查 workflow 成功及公開文章重新整理。把真實 Repository 與網站連結補入本文件，填入姓名學號，並以 Word 匯出最終 PDF。'),
('body','課程要求最後繳交兩個檔案：作業說明 PDF 與 AGENTS.md。另保留 Word 原稿以利修改。現有 PDF 由相同內容來源另行排版；環境缺少文件轉檔器，尚未完成 Word 匯出 PDF 及 Word 版面渲染驗證。'),
]]

def build_docx():
 doc=Document(); section=doc.sections[0]; section.page_width=Inches(8.27);section.page_height=Inches(11.69);section.top_margin=Inches(.65);section.bottom_margin=Inches(.65);section.left_margin=Inches(.8);section.right_margin=Inches(.8)
 for name,size in [('Normal',10.5),('Title',24),('Subtitle',11),('Heading 1',13)]:
  style=doc.styles[name];style.font.name='Microsoft JhengHei';style.font.size=Pt(size);style.font.color.rgb=RGBColor(0,0,0);style._element.rPr.rFonts.set(qn('w:eastAsia'),'Microsoft JhengHei');style.paragraph_format.space_after=Pt(7)
 doc.styles['Normal'].paragraph_format.line_spacing=1.25
 for index,page in enumerate(pages):
  if index:doc.add_page_break()
  for kind,text in page:
   style={'title':'Title','subtitle':'Subtitle','heading':'Heading 1','body':'Normal'}[kind]
   p=doc.add_paragraph(text,style);p.paragraph_format.keep_with_next=kind in ['title','subtitle','heading']
 doc.core_properties.title='CodeQuick 程式語法速查手冊作業說明';doc.core_properties.subject='Homework 9 AGENTS.md';doc.core_properties.author=''
 doc.save(root/'docs/homework.docx')

def build_pdf():
 font=Path('C:/Windows/Fonts/msjh.ttc')
 if not font.exists(): raise RuntimeError('需 Microsoft JhengHei 字體；請指定可嵌入的繁中文字體')
 pdfmetrics.registerFont(TTFont('CJK',str(font),subfontIndex=0))
 styles={
 'title':ParagraphStyle('title',fontName='CJK',fontSize=22,leading=30,spaceAfter=14,textColor=HexColor('#000000'),wordWrap='CJK'),
 'subtitle':ParagraphStyle('subtitle',fontName='CJK',fontSize=11,leading=18,spaceAfter=12,wordWrap='CJK'),
 'heading':ParagraphStyle('heading',fontName='CJK',fontSize=13,leading=20,spaceBefore=10,spaceAfter=6,keepWithNext=True,wordWrap='CJK'),
 'body':ParagraphStyle('body',fontName='CJK',fontSize=10.3,leading=17,spaceAfter=8,wordWrap='CJK'),
 }
 story=[]
 for index,page in enumerate(pages):
  if index:story.append(PageBreak())
  for kind,text in page:story.append(Paragraph(escape(text),styles[kind]))
 def footer(canvas,doc):
  canvas.setFont('CJK',8);canvas.setFillColor(HexColor('#666666'));canvas.drawString(57,27,'CodeQuick  |  Homework 9');canvas.drawRightString(538,27,str(doc.page))
 SimpleDocTemplate(str(root/'docs/homework.pdf'),pagesize=(595.28,841.89),rightMargin=57,leftMargin=57,topMargin=42,bottomMargin=42,title='CodeQuick 程式語法速查手冊作業說明',author='').build(story,onFirstPage=footer,onLaterPages=footer)

if __name__=='__main__':build_docx();build_pdf();print('Created docs/homework.docx and docs/homework.pdf')
