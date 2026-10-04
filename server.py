import sys
import os
import json
import hashlib
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(BASE_DIR, "tts_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

class VokabelStarHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/tts':
            query = urllib.parse.parse_qs(parsed.query)
            text = query.get('text', [''])[0].strip()
            lang = query.get('lang', ['en-US'])[0].strip()
            if not text:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "Missing text"}')
                return

            try:
                cache_key = hashlib.md5(f"{lang}_{text}".encode('utf-8')).hexdigest()
                wav_filename = f"{cache_key}.wav"
                wav_path = os.path.join(CACHE_DIR, wav_filename)

                chosen_voice_name = "Microsoft Zira Desktop - English (United States)"

                if not os.path.exists(wav_path) or os.path.getsize(wav_path) == 0:
                    import win32com.client
                    import pythoncom
                    pythoncom.CoInitialize()

                    voice = win32com.client.Dispatch('SAPI.SpVoice')
                    stream = win32com.client.Dispatch('SAPI.SpFileStream')

                    target_lang_prefix = lang[:2].lower()
                    chosen = None
                    voices = voice.GetVoices()
                    for i in range(voices.Count):
                        desc = voices.Item(i).GetDescription().lower()
                        if target_lang_prefix == 'en':
                            if 'zira' in desc or 'english' in desc or 'david' in desc or 'mark' in desc:
                                chosen = voices.Item(i)
                                chosen_voice_name = voices.Item(i).GetDescription()
                                break
                        elif target_lang_prefix == 'de':
                            if 'hedda' in desc or 'german' in desc or 'deutsch' in desc or 'stefan' in desc or 'katja' in desc:
                                chosen = voices.Item(i)
                                chosen_voice_name = voices.Item(i).GetDescription()
                                break

                    if chosen:
                        voice.Voice = chosen

                    # 3 = SSFMCreateForWrite
                    stream.Open(wav_path, 3, False)
                    voice.AudioOutputStream = stream
                    voice.Speak(text)
                    stream.Close()

                resp_data = {
                    "ok": True,
                    "url": f"/tts_cache/{wav_filename}",
                    "voice": chosen_voice_name
                }
                resp_bytes = json.dumps(resp_data).encode('utf-8')

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(resp_bytes)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(resp_bytes)
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(e)}).encode('utf-8'))
                return
        else:
            super().do_GET()

def run(port=8090):
    os.chdir(BASE_DIR)
    server = HTTPServer(('127.0.0.1', port), VokabelStarHandler)
    print(f'VokabelStar Native Server running on http://localhost:{port}')
    server.serve_forever()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
    run(port)
