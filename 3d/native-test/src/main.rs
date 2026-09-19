use windows::{
    core::PCWSTR,
    Win32::{
        Foundation::{HWND, LPARAM, LRESULT, WPARAM},
        Graphics::{
            Direct3D::D3D_FEATURE_LEVEL_11_0,
            Direct3D12::{
    D3D12_COMMAND_LIST_TYPE_DIRECT,
    D3D12_COMMAND_QUEUE_DESC,
    D3D12_COMMAND_QUEUE_FLAGS_NONE,
    D3D12CreateDevice,
    ID3D12Device,
},
        },
        System::LibraryLoader::GetModuleHandleW,
        UI::WindowsAndMessaging::{
            CreateWindowExW,
            DefWindowProcW,
            DispatchMessageW,
            GetMessageW,
            LoadCursorW,
            PostQuitMessage,
            RegisterClassW,
            ShowWindow,
            TranslateMessage,
            CS_HREDRAW,
            CS_VREDRAW,
            CW_USEDEFAULT,
            IDC_ARROW,
            MSG,
            SW_SHOW,
            WINDOW_EX_STYLE,
            WNDCLASSW,
            WS_OVERLAPPEDWINDOW,
            WM_DESTROY,
        },
    },
};

fn main() {
    unsafe {
        // ==========================================
        // 🪟 CREATE WINDOWS WINDOW
        // ==========================================

        let module = GetModuleHandleW(None).unwrap();

        let instance =
            windows::Win32::Foundation::HINSTANCE(module.0);

        let class_name: Vec<u16> =
            "JungleGameNativeWindow\0"
                .encode_utf16()
                .collect();

        let window_class = WNDCLASSW {
            style: CS_HREDRAW | CS_VREDRAW,
            lpfnWndProc: Some(window_proc),
            hInstance: instance,
            hCursor: LoadCursorW(None, IDC_ARROW).unwrap(),
            lpszClassName: PCWSTR(class_name.as_ptr()),
            ..Default::default()
        };

        RegisterClassW(&window_class);

        let title: Vec<u16> =
            "JungleGame — DirectX 12 Native Test\0"
                .encode_utf16()
                .collect();

        let hwnd: HWND = CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            PCWSTR(class_name.as_ptr()),
            PCWSTR(title.as_ptr()),
            WS_OVERLAPPEDWINDOW,
            CW_USEDEFAULT,
            CW_USEDEFAULT,
            1280,
            720,
            None,
            None,
            Some(instance),
            None,
        )
        .unwrap();

        let _ = ShowWindow(hwnd, SW_SHOW);

        // ==========================================
        // 🎮 CREATE DIRECTX 12 DEVICE
        // ==========================================

      let mut device: Option<ID3D12Device> = None;

D3D12CreateDevice(
    None,
    D3D_FEATURE_LEVEL_11_0,
    &mut device,
)
.expect("Failed to create DirectX 12 device");

let device = device.expect("DirectX 12 returned no device");
// ==========================================
// 📋 CREATE DIRECTX 12 COMMAND QUEUE
// ==========================================

use windows::Win32::Graphics::Direct3D12::{
    D3D12_COMMAND_LIST_TYPE_DIRECT,
    D3D12_COMMAND_QUEUE_DESC,
};

let queue_description = D3D12_COMMAND_QUEUE_DESC {
    Type: D3D12_COMMAND_LIST_TYPE_DIRECT,
    Priority: 0,
    Flags: D3D12_COMMAND_QUEUE_FLAGS_NONE,
    NodeMask: 0,
};

let command_queue = device
    .CreateCommandQueue(&queue_description)
    .expect("Failed to create DirectX 12 command queue");



        println!("==========================================");
        println!("🌴 JungleGame Native Renderer");
        println!("==========================================");
        println!("✅ Windows window created");
        println!("✅ DirectX 12 device created");
        println!("🎮 GPU is accessible through D3D12");
        println!("✅ DirectX 12 command queue created");
        println!("==========================================");

        // Keep the device alive.
        let _device = device;

        // ==========================================
        // 🪟 WINDOWS MESSAGE LOOP
        // ==========================================

        let mut message = MSG::default();

        while GetMessageW(&mut message, None, 0, 0).into() {
            let _ = TranslateMessage(&message);
            DispatchMessageW(&message);
        }
    }
}

extern "system" fn window_proc(
    hwnd: HWND,
    message: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    unsafe {
        if message == WM_DESTROY {
            PostQuitMessage(0);
            return LRESULT(0);
        }

        DefWindowProcW(
            hwnd,
            message,
            wparam,
            lparam,
        )
    }
}