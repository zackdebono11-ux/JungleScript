use windows::{
    core::{Interface, PCWSTR},
    Win32::{
        Foundation::{
            HWND,
            LPARAM,
            LRESULT,
            WPARAM,
        },

        Graphics::{
            Direct3D::D3D_FEATURE_LEVEL_11_0,

           Direct3D12::{
    D3D12_COMMAND_LIST_TYPE_DIRECT,
    D3D12_COMMAND_QUEUE_DESC,
    D3D12_COMMAND_QUEUE_FLAG_NONE,
    D3D12_DESCRIPTOR_HEAP_DESC,
    D3D12_DESCRIPTOR_HEAP_FLAG_NONE,
    D3D12_DESCRIPTOR_HEAP_TYPE_RTV,
    D3D12CreateDevice,
    ID3D12CommandQueue,
    ID3D12DescriptorHeap,
    ID3D12Device,
    D3D12_CPU_DESCRIPTOR_HANDLE,
ID3D12Resource,
ID3D12CommandAllocator,
ID3D12GraphicsCommandList,
D3D12_RESOURCE_BARRIER,
D3D12_RESOURCE_BARRIER_0,
D3D12_RESOURCE_BARRIER_TYPE_TRANSITION,
D3D12_RESOURCE_STATE_PRESENT,
D3D12_RESOURCE_STATE_RENDER_TARGET,
D3D12_RESOURCE_TRANSITION_BARRIER,
D3D12_FENCE_FLAG_NONE,
ID3D12Fence,
D3D12_HEAP_PROPERTIES,
D3D12_HEAP_TYPE_UPLOAD,
D3D12_RESOURCE_DESC,
D3D12_RESOURCE_DIMENSION_BUFFER,
D3D12_RESOURCE_STATE_GENERIC_READ,
D3D12_TEXTURE_LAYOUT_ROW_MAJOR,
D3D12_HEAP_FLAG_NONE,
D3D12_VERTEX_BUFFER_VIEW,
D3D12_ROOT_SIGNATURE_DESC,
D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT,
D3D12_INPUT_ELEMENT_DESC,
D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA,
D3D12_GRAPHICS_PIPELINE_STATE_DESC,
D3D12_BLEND_DESC,
D3D12_RASTERIZER_DESC,
D3D12_DEPTH_STENCIL_DESC,
D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,

D3D12_INPUT_LAYOUT_DESC,
D3D12_SHADER_BYTECODE,
D3D12_CULL_MODE_NONE,
D3D12_FILL_MODE_SOLID,

D3D12SerializeRootSignature,
D3D_ROOT_SIGNATURE_VERSION_1,
ID3D12RootSignature,

ID3D12PipelineState,
D3D12_BLEND_ONE,
D3D12_BLEND_ZERO,
D3D12_BLEND_OP_ADD,
D3D12_LOGIC_OP_NOOP,
D3D12_COLOR_WRITE_ENABLE_ALL,
D3D12_DEPTH_WRITE_MASK_ZERO,
D3D12_COMPARISON_FUNC_ALWAYS,
D3D12_PIPELINE_STATE_FLAG_NONE,
D3D12_CACHED_PIPELINE_STATE,
D3D12_RENDER_TARGET_BLEND_DESC,
},

            Dxgi::{
                Common::{
                    DXGI_FORMAT_UNKNOWN,
                    DXGI_FORMAT_R8G8B8A8_UNORM,
                    DXGI_SAMPLE_DESC,
                },
                CreateDXGIFactory2,
                IDXGIFactory4,
                IDXGISwapChain3,
                DXGI_SWAP_CHAIN_DESC1,
                DXGI_SWAP_EFFECT_FLIP_DISCARD,
                DXGI_USAGE_RENDER_TARGET_OUTPUT,
                DXGI_PRESENT,
            },
        },

        System::{
            LibraryLoader::GetModuleHandleW,
            Threading::{
    CreateEventW,
    WaitForSingleObject,
    INFINITE,
},
        },

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
#[repr(C)]
#[derive(Clone, Copy)]
struct Vertex {
    position: [f32; 3],
}
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
// 🔺 TRIANGLE VERTICES
// ==========================================

let triangle_vertices = [
    Vertex {
        position: [0.0, 0.5, 0.0],
    },

    Vertex {
        position: [0.5, -0.5, 0.0],
    },

    Vertex {
        position: [-0.5, -0.5, 0.0],
    },
];

println!("✅ Triangle vertices created");

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
// 🔺 CREATE GPU VERTEX BUFFER
// ==========================================

let vertex_buffer_size =
    std::mem::size_of_val(&triangle_vertices) as u64;

let heap_properties = D3D12_HEAP_PROPERTIES {
    Type: D3D12_HEAP_TYPE_UPLOAD,
    CPUPageProperty: Default::default(),
    MemoryPoolPreference: Default::default(),
    CreationNodeMask: 1,
    VisibleNodeMask: 1,
};

let buffer_description = D3D12_RESOURCE_DESC {
    Dimension: D3D12_RESOURCE_DIMENSION_BUFFER,
    Alignment: 0,
    Width: vertex_buffer_size,
    Height: 1,
    DepthOrArraySize: 1,
    MipLevels: 1,
    Format: windows::Win32::Graphics::Dxgi::Common::DXGI_FORMAT_UNKNOWN,
    SampleDesc: DXGI_SAMPLE_DESC {
        Count: 1,
        Quality: 0,
    },
    Layout: D3D12_TEXTURE_LAYOUT_ROW_MAJOR,
    Flags: Default::default(),
};

let mut vertex_buffer: Option<ID3D12Resource> = None;

device
    .CreateCommittedResource(
        &heap_properties,
        D3D12_HEAP_FLAG_NONE,
        &buffer_description,
        D3D12_RESOURCE_STATE_GENERIC_READ,
        None,
        &mut vertex_buffer,
    )
    .expect("Failed to create GPU vertex buffer");

let vertex_buffer =
    vertex_buffer.expect("DirectX 12 did not return the vertex buffer");

println!("✅ GPU vertex buffer created");
unsafe {
    let mut mapped_data: *mut std::ffi::c_void = std::ptr::null_mut();

    vertex_buffer
        .Map(
            0,
            None,
            Some(&mut mapped_data),
        )
        .expect("Failed to map vertex buffer");

    std::ptr::copy_nonoverlapping(
        triangle_vertices.as_ptr() as *const u8,
        mapped_data as *mut u8,
        std::mem::size_of_val(&triangle_vertices),
    );

    vertex_buffer.Unmap(0, None);
}

println!("✅ Triangle vertices copied into GPU buffer");
let vertex_buffer_view = D3D12_VERTEX_BUFFER_VIEW {
    BufferLocation: vertex_buffer.GetGPUVirtualAddress(),
    SizeInBytes: std::mem::size_of_val(&triangle_vertices) as u32,
    StrideInBytes: std::mem::size_of::<Vertex>() as u32,
};

println!("✅ Vertex buffer view created");
let input_element = D3D12_INPUT_ELEMENT_DESC {
    SemanticName: windows::core::PCSTR(b"POSITION\0".as_ptr()),
    SemanticIndex: 0,
    Format: windows::Win32::Graphics::Dxgi::Common::DXGI_FORMAT_R32G32B32_FLOAT,
    InputSlot: 0,
    AlignedByteOffset: 0,
    InputSlotClass: D3D12_INPUT_CLASSIFICATION_PER_VERTEX_DATA,
    InstanceDataStepRate: 0,
};

let input_layout = D3D12_INPUT_LAYOUT_DESC {
    pInputElementDescs: &input_element,
    NumElements: 1,
};

println!("✅ Input layout created");
// ==========================================
// 🔑 CREATE ROOT SIGNATURE
// ==========================================

let root_signature_description = D3D12_ROOT_SIGNATURE_DESC {
    NumParameters: 0,
    pParameters: std::ptr::null(),
    NumStaticSamplers: 0,
    pStaticSamplers: std::ptr::null(),
    Flags: D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT,
};

let mut serialized_root_signature = None;
let mut root_signature_error = None;

D3D12SerializeRootSignature(
    &root_signature_description,
    D3D_ROOT_SIGNATURE_VERSION_1,
    &mut serialized_root_signature,
    Some(&mut root_signature_error),
)
.expect("Failed to serialize root signature");

let serialized_root_signature =
    serialized_root_signature
        .expect("Root signature serialization returned no blob");

let root_signature =
    device
        .CreateRootSignature::<ID3D12RootSignature>(
            0,
            std::slice::from_raw_parts(
                serialized_root_signature.GetBufferPointer() as *const u8,
                serialized_root_signature.GetBufferSize(),
            ),
        )
        .expect("Failed to create root signature");

println!("✅ Root signature created");
// ==========================================
// 🎨 LOAD COMPILED HLSL SHADERS
// ==========================================

let vertex_shader =
    std::fs::read(
        r"C:\Users\farru\OneDrive\Desktop\JungleScript\3d\shaders\realistic_vs.dxil"
    )
    .expect("Failed to load vertex shader");

let pixel_shader =
    std::fs::read(
        r"C:\Users\farru\OneDrive\Desktop\JungleScript\3d\shaders\realistic_ps.dxil"
    )
    .expect("Failed to load pixel shader");

println!("✅ HLSL shaders loaded");
let vertex_shader_bytecode = D3D12_SHADER_BYTECODE {
    pShaderBytecode: vertex_shader.as_ptr() as *const std::ffi::c_void,
    BytecodeLength: vertex_shader.len(),
};

let pixel_shader_bytecode = D3D12_SHADER_BYTECODE {
    pShaderBytecode: pixel_shader.as_ptr() as *const std::ffi::c_void,
    BytecodeLength: pixel_shader.len(),
};

println!("✅ Shader bytecodes created");
// ==========================================
// 🎨 CREATE GRAPHICS PIPELINE STATE
// ==========================================

let blend_state = D3D12_BLEND_DESC {
    AlphaToCoverageEnable: false.into(),
    IndependentBlendEnable: false.into(),
    RenderTarget: [D3D12_RENDER_TARGET_BLEND_DESC {
        BlendEnable: false.into(),
        LogicOpEnable: false.into(),
        SrcBlend: D3D12_BLEND_ONE,
        DestBlend: D3D12_BLEND_ZERO,
        BlendOp: D3D12_BLEND_OP_ADD,
        SrcBlendAlpha: D3D12_BLEND_ONE,
        DestBlendAlpha: D3D12_BLEND_ZERO,
        BlendOpAlpha: D3D12_BLEND_OP_ADD,
        LogicOp: D3D12_LOGIC_OP_NOOP,
        RenderTargetWriteMask: D3D12_COLOR_WRITE_ENABLE_ALL.0 as u8,
    }; 8],
};

let rasterizer_state = D3D12_RASTERIZER_DESC {
    FillMode: D3D12_FILL_MODE_SOLID,
    CullMode: D3D12_CULL_MODE_NONE,
    FrontCounterClockwise: false.into(),
    DepthBias: 0,
    DepthBiasClamp: 0.0,
    SlopeScaledDepthBias: 0.0,
    DepthClipEnable: true.into(),
    MultisampleEnable: false.into(),
    AntialiasedLineEnable: false.into(),
    ForcedSampleCount: 0,
    ConservativeRaster: Default::default(),
};

let depth_stencil_state = D3D12_DEPTH_STENCIL_DESC {
    DepthEnable: false.into(),
    DepthWriteMask: D3D12_DEPTH_WRITE_MASK_ZERO,
    DepthFunc: D3D12_COMPARISON_FUNC_ALWAYS,
    StencilEnable: false.into(),
    StencilReadMask: 0,
    StencilWriteMask: 0,
    FrontFace: Default::default(),
    BackFace: Default::default(),
};

let pipeline_description = D3D12_GRAPHICS_PIPELINE_STATE_DESC {
    pRootSignature: std::mem::ManuallyDrop::new(
        Some(root_signature.clone())
    ),

    VS: vertex_shader_bytecode,
    PS: pixel_shader_bytecode,

    DS: Default::default(),
    HS: Default::default(),
    GS: Default::default(),

    StreamOutput: Default::default(),

    BlendState: blend_state,
    SampleMask: u32::MAX,
    RasterizerState: rasterizer_state,
    DepthStencilState: depth_stencil_state,

    InputLayout: input_layout,

    IBStripCutValue: Default::default(),

    PrimitiveTopologyType:
        D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE,

    NumRenderTargets: 1,

    RTVFormats: [
        DXGI_FORMAT_R8G8B8A8_UNORM,
        DXGI_FORMAT_UNKNOWN,
        DXGI_FORMAT_UNKNOWN,
        DXGI_FORMAT_UNKNOWN,
        DXGI_FORMAT_UNKNOWN,
        DXGI_FORMAT_UNKNOWN,
        DXGI_FORMAT_UNKNOWN,
        DXGI_FORMAT_UNKNOWN,
    ],

    DSVFormat: DXGI_FORMAT_UNKNOWN,

    SampleDesc: DXGI_SAMPLE_DESC {
        Count: 1,
        Quality: 0,
    },

    NodeMask: 0,

    CachedPSO: D3D12_CACHED_PIPELINE_STATE {
        pCachedBlob: std::ptr::null(),
        CachedBlobSizeInBytes: 0,
    },

    Flags: D3D12_PIPELINE_STATE_FLAG_NONE,
};

let graphics_pipeline: ID3D12PipelineState =
    device
        .CreateGraphicsPipelineState(&pipeline_description)
        .expect("Failed to create graphics pipeline state");

println!("✅ Graphics pipeline state created");

// ==========================================
// 📋 CREATE DIRECTX 12 COMMAND QUEUE
// ==========================================



let queue_description = D3D12_COMMAND_QUEUE_DESC {
    Type: D3D12_COMMAND_LIST_TYPE_DIRECT,
    Priority: 0,
    Flags: D3D12_COMMAND_QUEUE_FLAG_NONE,
    NodeMask: 0,
};

let command_queue: ID3D12CommandQueue = device
    .CreateCommandQueue(&queue_description)
    .expect("Failed to create DirectX 12 command queue");
    // ==========================================
// DXGI FACTORY
// ==========================================

let factory: IDXGIFactory4 =
   CreateDXGIFactory2(
    windows::Win32::Graphics::Dxgi::DXGI_CREATE_FACTORY_FLAGS(0)
)
        .expect("Failed to create DXGI factory");

println!("✅ DXGI factory created");


// ==========================================
// SWAP CHAIN
// ==========================================

let swap_chain_description = DXGI_SWAP_CHAIN_DESC1 {
    Width: 1280,
    Height: 720,
    Format: DXGI_FORMAT_R8G8B8A8_UNORM,
    Stereo: false.into(),
    SampleDesc: DXGI_SAMPLE_DESC {
        Count: 1,
        Quality: 0,
    },
    BufferUsage: DXGI_USAGE_RENDER_TARGET_OUTPUT,
    BufferCount: 2,
    Scaling: Default::default(),
    SwapEffect: DXGI_SWAP_EFFECT_FLIP_DISCARD,
    AlphaMode: Default::default(),
    Flags: 0,
};

let swap_chain = factory
    .CreateSwapChainForHwnd(
        &command_queue,
        hwnd,
        &swap_chain_description,
        None,
        None,
    )
    .expect("Failed to create DXGI swap chain");

let swap_chain: IDXGISwapChain3 = swap_chain
    .cast()
    .expect("Failed to convert swap chain to IDXGISwapChain3");

println!("✅ DXGI swap chain created");
// ==========================================
// 🎨 CREATE RENDER TARGET DESCRIPTOR HEAP
// ==========================================

let rtv_heap_description = D3D12_DESCRIPTOR_HEAP_DESC {
    NumDescriptors: 2,
    Type: D3D12_DESCRIPTOR_HEAP_TYPE_RTV,
    Flags: D3D12_DESCRIPTOR_HEAP_FLAG_NONE,
    NodeMask: 0,
};

let rtv_heap: ID3D12DescriptorHeap = device
    .CreateDescriptorHeap(&rtv_heap_description)
    .expect("Failed to create RTV descriptor heap");

println!("✅ RTV descriptor heap created");
// ==========================================
// 🖼️ GET SWAP-CHAIN BACK BUFFERS
// ==========================================

let buffer0: ID3D12Resource = swap_chain
    .GetBuffer(0)
    .expect("Failed to get swap-chain buffer 0");

let buffer1: ID3D12Resource = swap_chain
    .GetBuffer(1)
    .expect("Failed to get swap-chain buffer 1");

println!("✅ Swap-chain back buffers acquired");
// ==========================================
// 🎨 CREATE RENDER TARGET VIEWS
// ==========================================

let rtv_descriptor_size =
    device.GetDescriptorHandleIncrementSize(
        D3D12_DESCRIPTOR_HEAP_TYPE_RTV,
    );

let rtv_heap_start =
    rtv_heap.GetCPUDescriptorHandleForHeapStart();

let rtv0 = D3D12_CPU_DESCRIPTOR_HANDLE {
    ptr: rtv_heap_start.ptr,
};

let rtv1 = D3D12_CPU_DESCRIPTOR_HANDLE {
    ptr: rtv_heap_start.ptr
        + rtv_descriptor_size as usize,
};

device.CreateRenderTargetView(
    &buffer0,
    None,
    rtv0,
);

device.CreateRenderTargetView(
    &buffer1,
    None,
    rtv1,
);

println!("✅ Render target views created");
// ==========================================
// 📦 CREATE COMMAND ALLOCATOR
// ==========================================

let command_allocator: ID3D12CommandAllocator = device
    .CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT)
    .expect("Failed to create command allocator");

println!("✅ DirectX 12 command allocator created");
// ==========================================
// 🔒 CREATE GPU FENCE
// ==========================================

let fence: ID3D12Fence = device
    .CreateFence(
        0,
        D3D12_FENCE_FLAG_NONE,
    )
    .expect("Failed to create GPU fence");

println!("✅ GPU fence created");
let fence_event = CreateEventW(
    None,
    false,
    false,
    None,
)
.expect("Failed to create fence event");

println!("✅ GPU fence event created");
// ==========================================
// 📝 CREATE GRAPHICS COMMAND LIST
// ==========================================

let command_list: ID3D12GraphicsCommandList = device
    .CreateCommandList(
        0,
        D3D12_COMMAND_LIST_TYPE_DIRECT,
        &command_allocator,
        None,
    )
    .expect("Failed to create graphics command list");

println!("✅ DirectX 12 graphics command list created");
// ==========================================
// 🟩 RECORD FIRST RENDER COMMANDS
// ==========================================

let current_back_buffer = swap_chain
    .GetCurrentBackBufferIndex();

let current_buffer = if current_back_buffer == 0 {
    &buffer0
} else {
    &buffer1
};

let current_rtv = if current_back_buffer == 0 {
    rtv0
} else {
    rtv1
};

let barrier = D3D12_RESOURCE_BARRIER {
    Type: D3D12_RESOURCE_BARRIER_TYPE_TRANSITION,
    Flags: Default::default(),
    Anonymous: D3D12_RESOURCE_BARRIER_0 {
        Transition: std::mem::ManuallyDrop::new(
            D3D12_RESOURCE_TRANSITION_BARRIER {
                pResource: std::mem::ManuallyDrop::new(
    Some(current_buffer.clone())
),
                Subresource: 0,
                StateBefore: D3D12_RESOURCE_STATE_PRESENT,
                StateAfter: D3D12_RESOURCE_STATE_RENDER_TARGET,
            },
        ),
    },
};

command_list.ResourceBarrier(&[barrier]);

command_list.ClearRenderTargetView(
    current_rtv,
    &[0.05, 0.25, 0.10, 1.0],
    None,
);

println!("✅ First render command recorded");
// ==========================================
// 🔒 CLOSE COMMAND LIST
// ==========================================

command_list
    .Close()
    .expect("Failed to close command list");

println!("✅ Graphics command list closed");
// ==========================================
// 🚀 SUBMIT COMMAND LIST TO GPU
// ==========================================

let command_lists = [Some(
    command_list
        .cast()
        .expect("Failed to cast command list"),
)];

command_queue.ExecuteCommandLists(&command_lists);

println!("✅ Render commands submitted to GPU");
// ==========================================
// 🔒 SIGNAL GPU FENCE
// ==========================================

let fence_value: u64 = 1;

command_queue
    .Signal(&fence, fence_value)
    .expect("Failed to signal GPU fence");

println!("✅ GPU fence signaled");
// ==========================================
// ⏳ WAIT FOR GPU
// ==========================================

if fence.GetCompletedValue() < fence_value {
    fence
        .SetEventOnCompletion(
            fence_value,
            fence_event,
        )
        .expect("Failed to set fence completion event");

    WaitForSingleObject(
        fence_event,
        INFINITE,
    );
}

println!("✅ GPU finished rendering");
// ==========================================
// 🖥️ PRESENT FRAME
// ==========================================

// ==========================================
// 🖥️ PRESENT FRAME
// ==========================================

let present_result = swap_chain.Present(
    1,
    DXGI_PRESENT(0),
);

present_result
    .ok()
    .expect("Failed to present frame");

println!("✅ First DirectX 12 frame presented!");



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

