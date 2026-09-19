// ==========================================
// 🌴 JungleGame Realistic Renderer
// HLSL v0.1
// ==========================================

struct VertexInput
{
    float3 position : POSITION;
    float3 normal   : NORMAL;
};

struct VertexOutput
{
    float4 position : SV_POSITION;
    float3 normal   : NORMAL;
};


// ==========================================
// CAMERA / WORLD DATA
// ==========================================

cbuffer CameraBuffer : register(b0)
{
    float4x4 world;
    float4x4 view;
    float4x4 projection;
};


// ==========================================
// VERTEX SHADER
// ==========================================

VertexOutput VSMain(VertexInput input)
{
    VertexOutput output;

    float4 worldPosition =
        mul(float4(input.position, 1.0f), world);

    output.position =
        mul(worldPosition, view);

    output.position =
        mul(output.position, projection);

    output.normal =
        normalize(
            mul(
                float4(input.normal, 0.0f),
                world
            ).xyz
        );

    return output;
}


// ==========================================
// PIXEL SHADER
// ==========================================

float4 PSMain(VertexOutput input) : SV_TARGET
{
    float3 baseColor =
        float3(0.25f, 0.65f, 0.35f);

    float3 lightDirection =
        normalize(
            float3(-0.5f, -1.0f, -0.5f)
        );

    float diffuse =
        max(
            dot(input.normal, -lightDirection),
            0.0f
        );

    float3 finalColor =
        baseColor * diffuse;

    return float4(
        finalColor,
        1.0f
    );
}