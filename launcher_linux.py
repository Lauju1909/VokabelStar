"""
VokabelStar - Linux Standalone Launcher
Startet lokalen Server und oeffnet die barrierefreie VokabelStar-App im Browser.
"""
import http.server
import os
import sys
import webbrowser

PORT = 48270
if getattr(sys, 'frozen', False):
    DIRECTORY = getattr(sys, '_MEIPASS', os.path.dirname(sys.executable))
else:
    DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    server_address = ('127.0.0.1', PORT)
    httpd = http.server.HTTPServer(server_address, Handler)
    target_file = "VokabelStar_App.html" if os.path.exists(os.path.join(DIRECTORY, "VokabelStar_App.html")) else "index.html"
    target = f"http://127.0.0.1:{PORT}/{target_file}"
    print(f"VokabelStar (Linux) aktiv auf: {target}")
    webbrowser.open(target)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

if __name__ == '__main__':
    main()
