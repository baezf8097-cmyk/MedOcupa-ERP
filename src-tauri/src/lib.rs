use std::net::TcpStream;
use std::process::{Child, Command};
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::Manager;

struct ServerState(Mutex<Option<Child>>);

fn get_user_appdata_dir() -> Option<String> {
    if let Some(appdata) = std::env::var_os("APPDATA") {
        let path = std::path::PathBuf::from(appdata).join("MedOcupaERP");
        let _ = std::fs::create_dir_all(&path);
        return Some(path.to_string_lossy().to_string());
    }
    if let Some(home) = std::env::var_os("HOME") {
        let path = std::path::PathBuf::from(home)
            .join(".config")
            .join("MedOcupaERP");
        let _ = std::fs::create_dir_all(&path);
        return Some(path.to_string_lossy().to_string());
    }
    None
}

fn is_port_open(port: u16) -> bool {
    TcpStream::connect_timeout(
        &format!("127.0.0.1:{}", port).parse().unwrap(),
        Duration::from_millis(300),
    )
    .is_ok()
}

fn spawn_backend_and_wait() -> Option<Child> {
    let port = 3000;

    // If port 3000 is already active (e.g. running in dev mode via npm run dev), no need to spawn
    if is_port_open(port) {
        println!("[MedOcupa ERP] Port {} already active. Connecting...", port);
        return None;
    }

    println!("[MedOcupa ERP] Spawning embedded Express server process...");

    let appdata_dir = get_user_appdata_dir();

    #[cfg(target_os = "windows")]
    let mut cmd = {
        let mut c = Command::new("cmd");
        c.args(&["/C", "node", "dist/server.cjs"]);
        c
    };

    #[cfg(not(target_os = "windows"))]
    let mut cmd = {
        let mut c = Command::new("node");
        c.arg("dist/server.cjs");
        c
    };

    if let Some(dir) = appdata_dir {
        cmd.env("APP_DATA_DIR", dir);
    }

    let child = match cmd.spawn() {
        Ok(c) => Some(c),
        Err(e) => {
            eprintln!("[MedOcupa ERP] Note: Node server process not spawned (standalone client mode active): {}", e);
            None
        }
    };

    if child.is_none() {
        println!("[MedOcupa ERP] Embedded frontend API engine active for desktop mode.");
        return None;
    }

    // Wait until port 3000 opens or timeout after 15 seconds
    let start_time = Instant::now();
    let timeout = Duration::from_secs(15);
    while start_time.elapsed() < timeout {
        if is_port_open(port) {
            println!("[MedOcupa ERP] Express server ready on port {}!", port);
            break;
        }
        std::thread::sleep(Duration::from_millis(250));
    }

    child
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let child_process = spawn_backend_and_wait();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(ServerState(Mutex::new(child_process)))
        .setup(|_app| {
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if let Some(state) = window.try_state::<ServerState>() {
                    if let Ok(mut lock) = state.0.lock() {
                        if let Some(mut child) = lock.take() {
                            let _ = child.kill();
                        }
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
