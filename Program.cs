using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

namespace VokabelStarApp
{
    static class Program
    {
        private const int BASE_PORT = 48200;
        private static int _activePort = BASE_PORT;
        private static TcpListener _tcpListener;
        private static Thread _serverThread;
        private static volatile bool _isRunning = true;

        private static string _activeStorageDir;
        private static string _cacheDir;
        private static string _htmlContent;

        [STAThread]
        static void Main(string[] args)
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                _activeStorageDir = baseDir;
                _cacheDir = Path.Combine(_activeStorageDir, "tts_cache");
                if (!Directory.Exists(_cacheDir))
                {
                    try { Directory.CreateDirectory(_cacheDir); } catch { }
                }

                // 1. Eingebettete HTML laden oder aus Datei lesen
                LoadAppHtml();

                // 2. Lokalen TCP Server starten (Zero Firewall Prompts)
                bool serverStarted = StartLocalServer();
                if (!serverStarted)
                {
                    // Fallback to next port
                    for (int p = BASE_PORT + 1; p < BASE_PORT + 20; p++)
                    {
                        if (TryStartServerOnPort(p)) { serverStarted = true; break; }
                    }
                }

                string url = string.Format("http://127.0.0.1:{0}/", _activePort);

                // 3. Browser im App-Modus öffnen (wie Desktop-App)
                LaunchAppBrowser(url);

                // 4. Server laufen lassen
                while (_isRunning)
                {
                    Thread.Sleep(1000);
                }
            }
            catch (Exception ex)
            {
                try
                {
                    File.WriteAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "crash_log.txt"), ex.ToString());
                }
                catch { }
            }
        }

        private static void LoadAppHtml()
        {
            try
            {
                var asm = Assembly.GetExecutingAssembly();
                using (var stream = asm.GetManifestResourceStream("VokabelStarApp.embedded_app.html"))
                {
                    if (stream != null)
                    {
                        using (var reader = new StreamReader(stream, Encoding.UTF8))
                        {
                            _htmlContent = reader.ReadToEnd();
                            return;
                        }
                    }
                }
            }
            catch { }

            string localHtml = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "VokabelStar_App.html");
            if (File.Exists(localHtml))
            {
                _htmlContent = File.ReadAllText(localHtml, Encoding.UTF8);
            }
            else
            {
                string indexHtml = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "index.html");
                if (File.Exists(indexHtml))
                {
                    _htmlContent = File.ReadAllText(indexHtml, Encoding.UTF8);
                }
            }
        }

        private static bool StartLocalServer()
        {
            return TryStartServerOnPort(BASE_PORT);
        }

        private static bool TryStartServerOnPort(int port)
        {
            try
            {
                var listener = new TcpListener(IPAddress.Loopback, port);
                listener.Start();

                _tcpListener = listener;
                _activePort = port;

                _serverThread = new Thread(() =>
                {
                    while (_isRunning && _tcpListener != null)
                    {
                        try
                        {
                            var client = _tcpListener.AcceptTcpClient();
                            ThreadPool.QueueUserWorkItem((state) => HandleClient(client));
                        }
                        catch { }
                    }
                });
                _serverThread.IsBackground = true;
                _serverThread.Start();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static void HandleClient(TcpClient client)
        {
            try
            {
                using (client)
                {
                    client.ReceiveTimeout = 6000;
                    client.SendTimeout = 6000;
                    using (var stream = client.GetStream())
                    {
                        var ms = new MemoryStream();
                        var buffer = new byte[8192];
                        int headerEnd = -1;

                        while (true)
                        {
                            int read = stream.Read(buffer, 0, buffer.Length);
                            if (read <= 0) break;
                            ms.Write(buffer, 0, read);

                            string currentText = Encoding.UTF8.GetString(ms.ToArray());
                            headerEnd = currentText.IndexOf("\r\n\r\n");
                            if (headerEnd >= 0) break;
                        }

                        if (headerEnd < 0) return;

                        byte[] allBytes = ms.ToArray();
                        string allText = Encoding.UTF8.GetString(allBytes);
                        string headerPart = allText.Substring(0, headerEnd);

                        string[] reqLines = headerPart.Split(new string[] { "\r\n" }, StringSplitOptions.None);
                        if (reqLines.Length == 0) return;

                        string[] reqFirst = reqLines[0].Split(' ');
                        if (reqFirst.Length < 2) return;

                        string method = reqFirst[0].ToUpper();
                        string rawUrl = reqFirst[1];

                        if (method == "OPTIONS")
                        {
                            SendResponse(stream, 200, "text/plain", new byte[0]);
                            return;
                        }

                        // 1. API: /api/tts?text=...&lang=...
                        if (rawUrl.StartsWith("/api/tts"))
                        {
                            HandleTtsRequest(stream, rawUrl);
                            return;
                        }

                        // 2. TTS Cache Audio: /tts_cache/...
                        if (rawUrl.StartsWith("/tts_cache/"))
                        {
                            string fileName = rawUrl.Substring("/tts_cache/".Length);
                            int qIdx = fileName.IndexOf('?');
                            if (qIdx >= 0) fileName = fileName.Substring(0, qIdx);
                            fileName = Path.GetFileName(fileName); // Prevent path traversal

                            string filePath = Path.Combine(_cacheDir, fileName);
                            if (File.Exists(filePath))
                            {
                                byte[] wavData = File.ReadAllBytes(filePath);
                                SendResponse(stream, 200, "audio/wav", wavData);
                                return;
                            }
                            else
                            {
                                SendResponse(stream, 404, "text/plain", Encoding.UTF8.GetBytes("Not Found"));
                                return;
                            }
                        }

                        // 3. Root HTML
                        if (rawUrl == "/" || rawUrl.StartsWith("/?") || rawUrl.StartsWith("/#") || rawUrl.StartsWith("/index.html") || rawUrl.StartsWith("/VokabelStar_App.html"))
                        {
                            if (string.IsNullOrEmpty(_htmlContent))
                            {
                                LoadAppHtml();
                            }
                            byte[] htmlBytes = Encoding.UTF8.GetBytes(_htmlContent ?? "<h1>VokabelStar wird geladen...</h1>");
                            SendResponse(stream, 200, "text/html; charset=utf-8", htmlBytes);
                            return;
                        }

                        // 4. Statische Dateien falls vorhanden (z. B. favicon oder beispiele)
                        string relPath = rawUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                        int qMark = relPath.IndexOf('?');
                        if (qMark >= 0) relPath = relPath.Substring(0, qMark);
                        string diskFile = Path.Combine(_activeStorageDir, relPath);
                        if (File.Exists(diskFile))
                        {
                            byte[] fileBytes = File.ReadAllBytes(diskFile);
                            string mime = GetMimeType(diskFile);
                            SendResponse(stream, 200, mime, fileBytes);
                            return;
                        }

                        // Default: Serve HTML app
                        byte[] fallbackBytes = Encoding.UTF8.GetBytes(_htmlContent ?? "");
                        SendResponse(stream, 200, "text/html; charset=utf-8", fallbackBytes);
                    }
                }
            }
            catch { }
        }

        private static void HandleTtsRequest(NetworkStream stream, string rawUrl)
        {
            try
            {
                int qIdx = rawUrl.IndexOf('?');
                string queryString = qIdx >= 0 ? rawUrl.Substring(qIdx + 1) : "";

                string text = "";
                string lang = "en-US";

                var parts = queryString.Split('&');
                foreach (var part in parts)
                {
                    var kv = part.Split('=');
                    if (kv.Length >= 2)
                    {
                        string k = Uri.UnescapeDataString(kv[0]);
                        string v = Uri.UnescapeDataString(kv[1]);
                        if (k == "text") text = v.Trim();
                        if (k == "lang") lang = v.Trim();
                    }
                }

                if (string.IsNullOrEmpty(text))
                {
                    byte[] err = Encoding.UTF8.GetBytes("{\"ok\":false,\"error\":\"Missing text\"}");
                    SendResponse(stream, 400, "application/json", err);
                    return;
                }

                string hash;
                using (var md5 = MD5.Create())
                {
                    byte[] hashBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(lang + "_" + text));
                    var sb = new StringBuilder();
                    foreach (byte b in hashBytes) sb.Append(b.ToString("x2"));
                    hash = sb.ToString();
                }

                string wavFilename = hash + ".wav";
                string wavPath = Path.Combine(_cacheDir, wavFilename);
                string voiceName = "Microsoft Zira Desktop - English (United States)";

                if (!File.Exists(wavPath) || new FileInfo(wavPath).Length == 0)
                {
                    voiceName = SynthesizeWavWithSapi(text, lang, wavPath);
                }

                string json = string.Format("{{\"ok\":true,\"url\":\"/tts_cache/{0}\",\"voice\":\"{1}\"}}", wavFilename, voiceName);
                byte[] jsonBytes = Encoding.UTF8.GetBytes(json);
                SendResponse(stream, 200, "application/json", jsonBytes);
            }
            catch (Exception ex)
            {
                byte[] err = Encoding.UTF8.GetBytes("{\"ok\":false,\"error\":\"" + ex.Message.Replace("\"", "\\\"") + "\"}");
                SendResponse(stream, 500, "application/json", err);
            }
        }

        private static string SynthesizeWavWithSapi(string text, string lang, string wavPath)
        {
            string chosenVoiceName = "Microsoft Zira Desktop - English (United States)";
            try
            {
                Type voiceType = Type.GetTypeFromProgID("SAPI.SpVoice");
                Type streamType = Type.GetTypeFromProgID("SAPI.SpFileStream");

                object voice = Activator.CreateInstance(voiceType);
                object spStream = Activator.CreateInstance(streamType);

                object voices = voiceType.InvokeMember("GetVoices", BindingFlags.InvokeMethod, null, voice, null);
                int count = (int)voices.GetType().InvokeMember("Count", BindingFlags.GetProperty, null, voices, null);

                string prefix = lang.Length >= 2 ? lang.Substring(0, 2).ToLower() : "en";
                object chosenItem = null;

                for (int i = 0; i < count; i++)
                {
                    object item = voices.GetType().InvokeMember("Item", BindingFlags.InvokeMethod, null, voices, new object[] { i });
                    string desc = (string)item.GetType().InvokeMember("GetDescription", BindingFlags.InvokeMethod, null, item, null);
                    string descLower = desc.ToLower();

                    if (prefix == "en")
                    {
                        if (descLower.Contains("zira") || descLower.Contains("english") || descLower.Contains("david"))
                        {
                            chosenItem = item;
                            chosenVoiceName = desc;
                            break;
                        }
                    }
                    else if (prefix == "de")
                    {
                        if (descLower.Contains("hedda") || descLower.Contains("german") || descLower.Contains("deutsch") || descLower.Contains("stefan"))
                        {
                            chosenItem = item;
                            chosenVoiceName = desc;
                            break;
                        }
                    }
                }

                if (chosenItem != null)
                {
                    voiceType.InvokeMember("Voice", BindingFlags.SetProperty, null, voice, new object[] { chosenItem });
                }

                // 3 = SSFMCreateForWrite
                streamType.InvokeMember("Open", BindingFlags.InvokeMethod, null, spStream, new object[] { wavPath, 3, false });
                voiceType.InvokeMember("AudioOutputStream", BindingFlags.SetProperty, null, voice, new object[] { spStream });
                voiceType.InvokeMember("Speak", BindingFlags.InvokeMethod, null, voice, new object[] { text });
                streamType.InvokeMember("Close", BindingFlags.InvokeMethod, null, spStream, null);
            }
            catch (Exception ex)
            {
                try
                {
                    File.WriteAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "tts_error.txt"), ex.ToString());
                }
                catch { }
            }
            return chosenVoiceName;
        }

        private static void SendResponse(NetworkStream stream, int statusCode, string contentType, byte[] content)
        {
            try
            {
                string statusMsg = statusCode == 200 ? "OK" : (statusCode == 404 ? "Not Found" : (statusCode == 400 ? "Bad Request" : "Internal Server Error"));
                string header = string.Format(
                    "HTTP/1.1 {0} {1}\r\n" +
                    "Content-Type: {2}\r\n" +
                    "Content-Length: {3}\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Connection: close\r\n\r\n",
                    statusCode, statusMsg, contentType, content.Length
                );
                byte[] headerBytes = Encoding.UTF8.GetBytes(header);
                stream.Write(headerBytes, 0, headerBytes.Length);
                if (content.Length > 0)
                {
                    stream.Write(content, 0, content.Length);
                }
                stream.Flush();
            }
            catch { }
        }

        private static string GetMimeType(string path)
        {
            string ext = Path.GetExtension(path).ToLower();
            if (ext == ".html" || ext == ".htm") return "text/html; charset=utf-8";
            if (ext == ".css") return "text/css; charset=utf-8";
            if (ext == ".js") return "application/javascript; charset=utf-8";
            if (ext == ".json") return "application/json";
            if (ext == ".wav") return "audio/wav";
            if (ext == ".mp3") return "audio/mpeg";
            if (ext == ".png") return "image/png";
            if (ext == ".jpg" || ext == ".jpeg") return "image/jpeg";
            if (ext == ".svg") return "image/svg+xml";
            if (ext == ".xlsx") return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            if (ext == ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            return "application/octet-stream";
        }

        private static void LaunchAppBrowser(string url)
        {
            try
            {
                // 1. Suche nach Microsoft Edge
                string edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe");
                if (!File.Exists(edgePath))
                {
                    edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe");
                }

                if (File.Exists(edgePath))
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = edgePath,
                        Arguments = string.Format("--app=\"{0}\"", url),
                        UseShellExecute = true
                    });
                    return;
                }

                // 2. Suche nach Google Chrome
                string chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe");
                if (!File.Exists(chromePath))
                {
                    chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe");
                }

                if (File.Exists(chromePath))
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = chromePath,
                        Arguments = string.Format("--app=\"{0}\"", url),
                        UseShellExecute = true
                    });
                    return;
                }

                // 3. Fallback: Standardbrowser
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch
            {
                try
                {
                    Process.Start(url);
                }
                catch { }
            }
        }
    }
}
