from pathlib import Path
import sys

OLD = "https://euskadioposiciones.github.io/ehuoposicionesbateria/"
if len(sys.argv) != 2:
    raise SystemExit("Uso: python tools/update-base-url.py https://usuario.github.io/repositorio/")
new = sys.argv[1].rstrip('/') + '/'
root = Path(__file__).resolve().parents[1]
for rel in ["assets/js/config.js", "robots.txt", "sitemap.xml"]:
    p = root / rel
    text = p.read_text(encoding="utf-8")
    p.write_text(text.replace(OLD, new), encoding="utf-8")
print(f"URL base actualizada a: {new}")
