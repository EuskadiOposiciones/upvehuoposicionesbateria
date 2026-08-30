from pathlib import Path
import sys

OLD = "https://euskadioposiciones.github.io/upvehuoposicionesbateria/"
if len(sys.argv) != 2:
    raise SystemExit("Uso: python tools/update-base-url.py https://usuario.github.io/repositorio/")
new = sys.argv[1].rstrip('/') + '/'
root = Path(__file__).resolve().parents[1]
for p in root.rglob('*'):
    if p.is_file() and p.suffix.lower() in {'.html','.js','.xml','.txt','.md','.py'}:
        text = p.read_text(encoding='utf-8')
        if OLD in text:
            p.write_text(text.replace(OLD, new), encoding='utf-8')
print(f"URL base actualizada a: {new}")
