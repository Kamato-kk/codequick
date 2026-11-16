"""以 /codequick/ 服務網站，用於驗證 GitHub Pages 專案子路徑。"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import os
os.chdir(Path(__file__).resolve().parent.parent)
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  if self.path == '/':
   self.send_response(302); self.send_header('Location','/codequick/'); self.end_headers(); return
  if urlsplit(self.path).path.startswith('/codequick/'):
   self.path=self.path[len('/codequick'):]
   return super().do_GET()
  self.send_error(404)
print('Local preview: http://127.0.0.1:8000/codequick/',flush=True)
ThreadingHTTPServer(('127.0.0.1',8000),Handler).serve_forever()
