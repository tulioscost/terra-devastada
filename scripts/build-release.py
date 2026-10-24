#!/usr/bin/env python3
"""Pacote instalável Foundry no layout terra-devastada/system.json."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import json

ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'system.json').read_text(encoding='utf-8'))
version=manifest['version']
assert manifest['id']=='terra-devastada'
DIST=ROOT/'dist'
DIST.mkdir(exist_ok=True)
include=['system.json','LICENSE-NOTICE.txt']
for dirname in ['module','templates','styles','assets','lang','data','macros']:
    include.extend(str(p.relative_to(ROOT)) for p in sorted((ROOT/dirname).rglob('*')) if p.is_file())
filename=f'terra-devastada-v{version}.zip'
with ZipFile(DIST/filename,'w',ZIP_DEFLATED,compresslevel=9) as z:
    for path in sorted(include):
        z.write(ROOT/path,arcname=f'terra-devastada/{path}')
with ZipFile(DIST/filename) as z:
    assert z.testzip() is None
    assert f'terra-devastada/system.json' in z.namelist()
(DIST/'system.json').write_text((ROOT/'system.json').read_text(encoding='utf-8'),encoding='utf-8')
print(DIST/filename)
