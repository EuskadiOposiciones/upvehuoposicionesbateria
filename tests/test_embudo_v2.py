"""Pruebas de compatibilidad, idempotencia y no sustitución de contenido V1."""
import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'aplicar_embudo_v2.py'
spec = importlib.util.spec_from_file_location('ehu_funnel_patch', SCRIPT)
patch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(patch)

HEAD = '<!doctype html><html lang="es"><head><link rel="canonical" href="https://euskadioposiciones.com/upvehuoposicionesbateria/"></head>'

def wrap(body): return HEAD + '<body>' + body + '</body></html>'

class EmbudoV2Tests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='ehu-v2-')
        self.root = Path(self.tmp.name)
        self.old_root = patch.ROOT
        patch.ROOT = self.root
        fixtures = {
            'index.html': wrap('<div class="actions seo-hero-actions"><a>antiguo</a></div><div data-seo-demo>Hacer el test gratuito de 10</div><p>DATOS HISTÓRICOS V1</p>'),
            'administrativo/index.html': wrap('<!-- EHU-SEO-CONVERSION-V1 --><div class="seo-action-band">V1 ORIGINAL ADMIN</div>'),
            'baterias/index.html': wrap('<!-- EHU-SEO-CONVERSION-V1 --><div class="seo-action-band">V1 ORIGINAL BATERÍAS</div>'),
            'administrativo/test-gratis/index.html': wrap('<section class="section"><div class="wrap content"><div>10 preguntas · 4 opciones · corrección inmediata.</div><div id="free-test" class="quiz-shell" data-question-count="10"><div class="quiz-start"><button>Empezar test</button></div><div class="quiz-stage" hidden></div><div class="quiz-result" hidden></div></div></div></section><script>window.EHU_FREE_TEST=[{original:true}];</script><script src="../../assets/js/test-gratis.js"></script>'),
            'administrativo/app-test-upv-ehu/index.html': wrap('<section class="section"><div class="wrap content">PRECIOS EN GOOGLE PLAY</div></section>'),
            'bateria-500-preguntas-administrativo-ehu/index.html': wrap('<div class="actions" data-practice-choice><a>guía histórica</a></div>'),
        }
        for path, text in fixtures.items():
            dest = self.root / path; dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(text, encoding='utf-8')
        for path in [patch.CSS, patch.JS, patch.QUIZJS, 'assets/css/seo-ehu.css', 'assets/js/seo-ehu.js', 'assets/js/site.js', 'assets/img/app/qr-google-play.png', 'robots.txt']:
            f = self.root / path; f.parent.mkdir(parents=True, exist_ok=True); f.write_text('existe', encoding='utf-8')
        self.root.joinpath('sitemap.xml').write_text('<?xml version="1.0"?><urlset>' + ''.join('<url><loc>' + patch.BASE + p.removesuffix('index.html') + '</loc><lastmod>2026-09-29</lastmod><priority>0.9</priority></url>' for p in patch.PAGES) + '</urlset>',encoding='utf-8')

    def tearDown(self):
        patch.ROOT = self.old_root
        self.tmp.cleanup()

    def test_applies_six_and_is_idempotent(self):
        self.assertEqual(patch.main(), 0)
        state = {p: (self.root/p).read_text(encoding='utf-8') for p in patch.PAGES}
        self.assertTrue(all(patch.MARK in html and 'embudo-v2.js' in html for html in state.values()))
        self.assertIn('V1 ORIGINAL ADMIN', state['administrativo/index.html'])
        self.assertIn('V1 ORIGINAL BATERÍAS', state['baterias/index.html'])
        self.assertIn('DATOS HISTÓRICOS V1', state['index.html'])
        self.assertIn('window.EHU_FREE_TEST=[{original:true}]', state['administrativo/test-gratis/index.html'])
        self.assertIn('test-gratis-v2.js', state['administrativo/test-gratis/index.html'])
        self.assertNotIn('src="../../assets/js/test-gratis.js"',state['administrativo/test-gratis/index.html'])
        self.assertEqual(patch.main(), 0)
        for p in patch.PAGES:
            self.assertEqual(state[p],(self.root/p).read_text(encoding='utf-8'))
            self.assertEqual(state[p].count(patch.MARK),1)
        sitemap=(self.root/'sitemap.xml').read_text(encoding='utf-8')
        self.assertEqual(sitemap.count('<lastmod>'),len(patch.PAGES))

    def test_preflight_stops_without_partial_write(self):
        before=(self.root/'index.html').read_text(encoding='utf-8')
        (self.root/'administrativo/app-test-upv-ehu/index.html').write_text('<html>changed later</html>',encoding='utf-8')
        with self.assertRaises(ValueError):patch.main()
        self.assertEqual((self.root/'index.html').read_text(encoding='utf-8'), before)

if __name__=='__main__':unittest.main()
