"""只執行專案受信任的教學範例；不接受網站使用者輸入。"""
import json, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(__file__).resolve().parent.parent
articles = json.loads((root/'data/articles.json').read_text(encoding='utf-8-sig'))
passed = skipped = 0
for article in articles:
 for i, example in enumerate(article['examples']):
  with tempfile.TemporaryDirectory(prefix='codequick-') as folder:
   work = Path(folder)
   if article['language'] == 'python':
    source=work/'example.py'; source.write_text(example['code'],encoding='utf-8'); command=[sys.executable,str(source)]
   elif article['language'] == 'javascript':
    source=work/'example.mjs'; source.write_text(example['code'],encoding='utf-8'); command=['node',str(source)]
   else:
    compiler=shutil.which('g++') or shutil.which('clang++')
    if not compiler:
     print('SKIP C++ compiler unavailable:',article['id']); skipped+=1; continue
    source=work/'example.cpp'; source.write_text(example['code'],encoding='utf-8'); binary=work/'example.exe'
    subprocess.run([compiler,'-std=c++17','-Wall','-Wextra','-pedantic',str(source),'-o',str(binary)],check=True,capture_output=True,timeout=30)
    command=[str(binary)]
   result=subprocess.run(command,capture_output=True,text=True,encoding='utf-8',check=True,timeout=10)
   if result.stdout.replace('\r\n','\n').rstrip('\n') != example['output'].replace('\r\n','\n').rstrip('\n'):
    raise AssertionError(f"Output mismatch {article['id']}: {result.stdout!r}")
   print('PASS',article['id'],i+1); passed+=1
print(f'Examples: {passed} passed, {skipped} skipped')
if skipped and '--require-all' in sys.argv: sys.exit(1)
