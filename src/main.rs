#![windows_subsystem = "windows"]

use std::collections::hash_map::DefaultHasher;
use std::fs;
use std::hash::{Hash, Hasher};
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::{Child, Command};
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const APP_VERSION: &str = "2.1.0";
const BASE_PORT: u16 = 48200;
const MAX_PORT_OFFSET: u16 = 20;
const CREATE_NO_WINDOW: u32 = 0x08000000;
const EMBEDDED_APP_HTML: &str = include_str!("../VokabelStar_App.html");

struct ServerState {
    base_dir: PathBuf,
    tts_cache_dir: PathBuf,
    last_heartbeat: AtomicU64,
    running: AtomicBool,
    tts_lock: Mutex<()>,
}

fn now_secs() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

fn compute_cache_key(lang: &str, text: &str) -> String {
    let mut hasher1 = DefaultHasher::new();
    format!("vokabelstar_1_{}_{}", lang, text).hash(&mut hasher1);
    let h1 = hasher1.finish();

    let mut hasher2 = DefaultHasher::new();
    format!("vokabelstar_2_{}_{}", text, lang).hash(&mut hasher2);
    let h2 = hasher2.finish();

    format!("{:016x}{:016x}", h1, h2)
}

fn url_decode(input: &str) -> String {
    let mut bytes = Vec::with_capacity(input.len());
    let raw = input.as_bytes();
    let mut i = 0;
    while i < raw.len() {
        if raw[i] == b'+' {
            bytes.push(b' ');
            i += 1;
        } else if raw[i] == b'%' && i + 2 < raw.len() {
            if let Ok(hex_str) = std::str::from_utf8(&raw[i + 1..i + 3]) {
                if let Ok(val) = u8::from_str_radix(hex_str, 16) {
                    bytes.push(val);
                    i += 3;
                    continue;
                }
            }
            bytes.push(raw[i]);
            i += 1;
        } else {
            bytes.push(raw[i]);
            i += 1;
        }
    }
    String::from_utf8_lossy(&bytes).to_string()
}

fn get_query_param(query: &str, key: &str) -> String {
    for pair in query.split('&') {
        let mut kv = pair.splitn(2, '=');
        if let (Some(k), Some(v)) = (kv.next(), kv.next()) {
            if k.eq_ignore_ascii_case(key) {
                return url_decode(v);
            }
        }
    }
    String::new()
}

fn escape_json(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '\\' => out.push_str("\\\\"),
            '"' => out.push_str("\\\""),
            '\r' => out.push_str("\\r"),
            '\n' => out.push_str("\\n"),
            '\t' => out.push_str("\\t"),
            _ => out.push(c),
        }
    }
    out
}

fn synthesize_sapi_wav(text: &str, lang: &str, out_path: &Path) -> Result<String, String> {
    let lang_prefix = if lang.len() >= 2 {
        lang[..2].to_lowercase()
    } else {
        "en".to_string()
    };

    let ps_script = r#"
$ErrorActionPreference = 'Stop'
$text = $env:VOKABEL_TTS_TEXT
$langPrefix = $env:VOKABEL_TTS_LANG
$outPath = $env:VOKABEL_TTS_OUT

$voice = New-Object -ComObject SAPI.SpVoice
$stream = New-Object -ComObject SAPI.SpFileStream
$chosenName = 'Standard Windows SAPI Voice'
$voices = $voice.GetVoices()
for ($i = 0; $i -lt $voices.Count; $i++) {
    $v = $voices.Item($i)
    $desc = $v.GetDescription().ToLowerInvariant()
    if ($langPrefix -eq 'en') {
        if ($desc.Contains('zira') -or $desc.Contains('english') -or $desc.Contains('david') -or $desc.Contains('mark') -or $desc.Contains('hazel')) {
            $voice.Voice = $v
            $chosenName = $v.GetDescription()
            break
        }
    } elseif ($langPrefix -eq 'de') {
        if ($desc.Contains('hedda') -or $desc.Contains('german') -or $desc.Contains('deutsch') -or $desc.Contains('katja') -or $desc.Contains('stefan')) {
            $voice.Voice = $v
            $chosenName = $v.GetDescription()
            break
        }
    }
}
$stream.Open($outPath, 3, $false)
$voice.AudioOutputStream = $stream
[void]$voice.Speak($text)
$stream.Close()
Write-Output $chosenName
"#;

    let output = Command::new("powershell.exe")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            ps_script,
        ])
        .env("VOKABEL_TTS_TEXT", text)
        .env("VOKABEL_TTS_LANG", &lang_prefix)
        .env("VOKABEL_TTS_OUT", out_path.as_os_str())
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map_err(|e| format!("Failed to invoke SAPI synthesis: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).trim().to_string());
    }

    let voice_name = String::from_utf8_lossy(&output.stdout).trim().to_string();
    Ok(if voice_name.is_empty() {
        "Microsoft Windows SAPI".to_string()
    } else {
        voice_name
    })
}

fn send_http_response(
    stream: &mut TcpStream,
    status_code: u16,
    content_type: &str,
    body: &[u8],
) {
    let status_text = match status_code {
        200 => "OK",
        204 => "No Content",
        400 => "Bad Request",
        404 => "Not Found",
        _ => "Internal Server Error",
    };

    let headers = format!(
        "HTTP/1.1 {} {}\r\nContent-Type: {}\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\nAccept-Ranges: bytes\r\nCache-Control: no-cache\r\nConnection: close\r\n\r\n",
        status_code,
        status_text,
        content_type,
        body.len()
    );

    let _ = stream.write_all(headers.as_bytes());
    if !body.is_empty() {
        let _ = stream.write_all(body);
    }
    let _ = stream.flush();
}

fn content_type_for_path(path: &Path) -> &'static str {
    match path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase()
        .as_str()
    {
        "html" | "htm" => "text/html; charset=utf-8",
        "js" => "application/javascript; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "json" => "application/json; charset=utf-8",
        "wav" => "audio/wav",
        "mp3" => "audio/mpeg",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "svg" => "image/svg+xml",
        "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        _ => "application/octet-stream",
    }
}

fn handle_client(mut stream: TcpStream, state: Arc<ServerState>) {
    let _ = stream.set_read_timeout(Some(Duration::from_secs(10)));
    let _ = stream.set_write_timeout(Some(Duration::from_secs(10)));

    let mut buf = [0u8; 16384];
    let n = match stream.read(&mut buf) {
        Ok(n) if n > 0 => n,
        _ => return,
    };

    let req_str = String::from_utf8_lossy(&buf[..n]);
    let first_line = match req_str.lines().next() {
        Some(l) => l,
        None => return,
    };

    let parts: Vec<&str> = first_line.split_whitespace().collect();
    if parts.len() < 2 {
        return;
    }

    let method = parts[0].to_uppercase();
    let raw_url = parts[1];

    state.last_heartbeat.store(now_secs(), Ordering::SeqCst);

    if method == "OPTIONS" {
        send_http_response(&mut stream, 204, "text/plain", b"");
        return;
    }

    let (path_part, query_part) = match raw_url.split_once('?') {
        Some((p, q)) => (p, q),
        None => (raw_url, ""),
    };

    if path_part == "/api/heartbeat" || path_part == "/api/ping" {
        let body = format!("{{\"ok\":true,\"version\":\"{}\",\"engine\":\"Rust\"}}", APP_VERSION);
        send_http_response(&mut stream, 200, "application/json; charset=utf-8", body.as_bytes());
        return;
    }

    if path_part == "/api/tts" {
        let text = get_query_param(query_part, "text").trim().to_string();
        let mut lang = get_query_param(query_part, "lang").trim().to_string();
        if lang.is_empty() {
            lang = "en-US".to_string();
        }
        if text.is_empty() {
            send_http_response(
                &mut stream,
                400,
                "application/json; charset=utf-8",
                b"{\"ok\":false,\"error\":\"Missing text\"}",
            );
            return;
        }

        let cache_key = compute_cache_key(&lang, &text);
        let wav_filename = format!("{}.wav", cache_key);
        let wav_path = state.tts_cache_dir.join(&wav_filename);

        let mut voice_used = "Microsoft Zira Desktop (Cached)".to_string();
        let needs_synth = !wav_path.is_file()
            || fs::metadata(&wav_path).map(|m| m.len() == 0).unwrap_or(true);

        if needs_synth {
            let _guard = state.tts_lock.lock().unwrap_or_else(|e| e.into_inner());
            if !wav_path.is_file()
                || fs::metadata(&wav_path).map(|m| m.len() == 0).unwrap_or(true)
            {
                match synthesize_sapi_wav(&text, &lang, &wav_path) {
                    Ok(v) => voice_used = v,
                    Err(err) => {
                        let resp = format!(
                            "{{\"ok\":false,\"error\":\"{}\"}}",
                            escape_json(&err)
                        );
                        send_http_response(
                            &mut stream,
                            500,
                            "application/json; charset=utf-8",
                            resp.as_bytes(),
                        );
                        return;
                    }
                }
            }
        }

        let resp = format!(
            "{{\"ok\":true,\"url\":\"/tts_cache/{}\",\"voice\":\"{}\"}}",
            wav_filename,
            escape_json(&voice_used)
        );
        send_http_response(&mut stream, 200, "application/json; charset=utf-8", resp.as_bytes());
        return;
    }

    if let Some(fname) = path_part.strip_prefix("/tts_cache/") {
        let safe_name = Path::new(fname)
            .file_name()
            .and_then(|s| s.to_str())
            .unwrap_or("");
        if !safe_name.is_empty() {
            let wav_path = state.tts_cache_dir.join(safe_name);
            if let Ok(bytes) = fs::read(&wav_path) {
                send_http_response(&mut stream, 200, "audio/wav", &bytes);
                return;
            }
        }
        send_http_response(&mut stream, 404, "text/plain; charset=utf-8", b"WAV Not Found");
        return;
    }

    if path_part == "/" || path_part == "/index.html" || path_part == "/VokabelStar_App.html" {
        let app_html_path = state.base_dir.join("VokabelStar_App.html");
        let index_html_path = state.base_dir.join("index.html");
        let html_bytes = if index_html_path.is_file() && state.base_dir.join("app.js").is_file() {
            fs::read(&index_html_path).unwrap_or_else(|_| EMBEDDED_APP_HTML.as_bytes().to_vec())
        } else if app_html_path.is_file() {
            fs::read(&app_html_path).unwrap_or_else(|_| EMBEDDED_APP_HTML.as_bytes().to_vec())
        } else {
            EMBEDDED_APP_HTML.as_bytes().to_vec()
        };
        send_http_response(&mut stream, 200, "text/html; charset=utf-8", &html_bytes);
        return;
    }

    let rel = url_decode(path_part.trim_start_matches('/'));
    if !rel.contains("..") {
        let candidate = state.base_dir.join(&rel);
        if candidate.is_file() {
            if let Ok(bytes) = fs::read(&candidate) {
                let ctype = content_type_for_path(&candidate);
                send_http_response(&mut stream, 200, ctype, &bytes);
                return;
            }
        }
    }

    send_http_response(&mut stream, 404, "text/plain; charset=utf-8", b"Not Found");
}

fn find_browser() -> Option<PathBuf> {
    let mut candidates = Vec::new();
    if let Ok(pf) = std::env::var("ProgramFiles") {
        candidates.push(PathBuf::from(&pf).join(r"Microsoft\Edge\Application\msedge.exe"));
        candidates.push(PathBuf::from(&pf).join(r"Google\Chrome\Application\chrome.exe"));
    }
    if let Ok(pf86) = std::env::var("ProgramFiles(x86)") {
        candidates.push(PathBuf::from(&pf86).join(r"Microsoft\Edge\Application\msedge.exe"));
        candidates.push(PathBuf::from(&pf86).join(r"Google\Chrome\Application\chrome.exe"));
    }
    if let Ok(local) = std::env::var("LOCALAPPDATA") {
        candidates.push(PathBuf::from(&local).join(r"Microsoft\Edge\Application\msedge.exe"));
        candidates.push(PathBuf::from(&local).join(r"Google\Chrome\Application\chrome.exe"));
    }
    candidates.into_iter().find(|p| p.is_file())
}

fn launch_browser(url: &str, profile_dir: &Path) -> Option<Child> {
    if let Some(browser) = find_browser() {
        Command::new(browser)
            .arg(format!("--app={}", url))
            .arg(format!("--user-data-dir={}", profile_dir.display()))
            .arg("--window-size=1280,860")
            .arg("--no-first-run")
            .arg("--no-default-browser-check")
            .arg("--disable-extensions")
            .arg("--autoplay-policy=no-user-gesture-required")
            .arg("--force-renderer-accessibility")
            .spawn()
            .ok()
    } else {
        let _ = Command::new("cmd")
            .args(["/C", "start", "", url])
            .creation_flags(CREATE_NO_WINDOW)
            .spawn();
        None
    }
}

fn cleanup_old_files(base_dir: &Path) {
    let old_exe = base_dir.join("VokabelStar.exe.old");
    if old_exe.is_file() {
        let _ = fs::remove_file(old_exe);
    }
}

fn main() {
    let exe_path = std::env::current_exe().unwrap_or_else(|_| PathBuf::from("."));
    let base_dir = exe_path.parent().unwrap_or_else(|| Path::new(".")).to_path_buf();

    cleanup_old_files(&base_dir);

    let local_app_data = std::env::var("LOCALAPPDATA")
        .unwrap_or_else(|_| r"C:\Users\Default\AppData\Local".to_string());
    let profile_dir = PathBuf::from(&local_app_data)
        .join("VokabelStarBrowser")
        .join("Profile");
    let _ = fs::create_dir_all(&profile_dir);

    let tts_cache_dir = base_dir.join(".tts_cache");
    let _ = fs::create_dir_all(&tts_cache_dir);
    #[cfg(windows)]
    {
        let _ = Command::new("attrib")
            .args(["+h", &tts_cache_dir.to_string_lossy()])
            .creation_flags(CREATE_NO_WINDOW)
            .output();
    }

    let mut bound_listener = None;
    let mut active_port = BASE_PORT;
    for port in BASE_PORT..=(BASE_PORT + MAX_PORT_OFFSET) {
        if let Ok(l) = TcpListener::bind(format!("127.0.0.1:{}", port)) {
            bound_listener = Some(l);
            active_port = port;
            break;
        }
    }

    let listener = match bound_listener {
        Some(l) => l,
        None => return,
    };

    let state = Arc::new(ServerState {
        base_dir: base_dir.clone(),
        tts_cache_dir,
        last_heartbeat: AtomicU64::new(now_secs()),
        running: AtomicBool::new(true),
        tts_lock: Mutex::new(()),
    });

    let server_state = Arc::clone(&state);
    thread::spawn(move || {
        for stream in listener.incoming().flatten() {
            if !server_state.running.load(Ordering::SeqCst) {
                break;
            }
            let st = Arc::clone(&server_state);
            thread::spawn(move || handle_client(stream, st));
        }
    });

    let launch_url = format!("http://127.0.0.1:{}/", active_port);
    let mut browser_proc = launch_browser(&launch_url, &profile_dir);

    let mut checks = 0u32;
    while state.running.load(Ordering::SeqCst) {
        thread::sleep(Duration::from_secs(1));
        checks += 1;
        if checks > 12 {
            let idle = now_secs().saturating_sub(state.last_heartbeat.load(Ordering::SeqCst));
            if idle > 15 {
                let exited = browser_proc
                    .as_mut()
                    .and_then(|c| c.try_wait().ok())
                    .map(|w| w.is_some())
                    .unwrap_or(true);
                if exited {
                    state.running.store(false, Ordering::SeqCst);
                    break;
                }
            }
        }
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_url_decode_and_query_params() {
        assert_eq!(url_decode("Hello+World%21"), "Hello World!");
        assert_eq!(url_decode("%C3%84pfel%20%26%20Birnen"), "Äpfel & Birnen");
        let q = "text=Good+morning%21&lang=en-US";
        assert_eq!(get_query_param(q, "text"), "Good morning!");
        assert_eq!(get_query_param(q, "lang"), "en-US");
    }

    #[test]
    fn test_cache_key_determinism_and_uniqueness() {
        let k1 = compute_cache_key("en-US", "entrepreneur");
        let k2 = compute_cache_key("en-US", "entrepreneur");
        let k3 = compute_cache_key("de-DE", "entrepreneur");
        assert_eq!(k1.len(), 32);
        assert_eq!(k1, k2);
        assert_ne!(k1, k3);
    }

    #[test]
    fn test_vokabelstar_http_endpoints_and_tts() {
        let temp_dir = std::env::temp_dir().join("vokabelstar_rust_test");
        let tts_dir = temp_dir.join(".tts_cache");
        let _ = fs::create_dir_all(&tts_dir);

        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let port = listener.local_addr().unwrap().port();

        let state = Arc::new(ServerState {
            base_dir: temp_dir.clone(),
            tts_cache_dir: tts_dir.clone(),
            last_heartbeat: AtomicU64::new(now_secs()),
            running: AtomicBool::new(true),
            tts_lock: Mutex::new(()),
        });

        let server_state = Arc::clone(&state);
        thread::spawn(move || {
            for stream in listener.incoming().flatten() {
                if !server_state.running.load(Ordering::SeqCst) {
                    break;
                }
                let st = Arc::clone(&server_state);
                handle_client(stream, st);
            }
        });

        // 1. Test /api/ping
        let mut s = TcpStream::connect(format!("127.0.0.1:{}", port)).unwrap();
        s.write_all(b"GET /api/ping HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n").unwrap();
        let mut resp = String::new();
        s.read_to_string(&mut resp).unwrap();
        assert!(resp.contains("HTTP/1.1 200 OK"));
        assert!(resp.contains("\"engine\":\"Rust\""));

        // 2. Test root HTML serving
        let mut s = TcpStream::connect(format!("127.0.0.1:{}", port)).unwrap();
        s.write_all(b"GET / HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n").unwrap();
        let mut resp = Vec::new();
        s.read_to_end(&mut resp).unwrap();
        let resp_str = String::from_utf8_lossy(&resp);
        assert!(resp_str.contains("HTTP/1.1 200 OK"));
        assert!(resp_str.contains("VokabelStar"));

        // 3. Pre-populate a cached WAV and verify /api/tts + /tts_cache/<file>.wav
        let key = compute_cache_key("en-US", "testword");
        let wav_file = tts_dir.join(format!("{}.wav", key));
        fs::write(&wav_file, b"RIFF____WAVEfmt ").unwrap();

        let mut s = TcpStream::connect(format!("127.0.0.1:{}", port)).unwrap();
        s.write_all(b"GET /api/tts?text=testword&lang=en-US HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n").unwrap();
        let mut resp = String::new();
        s.read_to_string(&mut resp).unwrap();
        assert!(resp.contains("\"ok\":true"));
        assert!(resp.contains(&format!("/tts_cache/{}.wav", key)));

        state.running.store(false, Ordering::SeqCst);
        let _ = fs::remove_dir_all(&temp_dir);
    }
}
