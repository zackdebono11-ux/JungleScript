cbuffer CameraBuffer : register(b0)
{
    float4x4 transform;
};

Texture2D shadowMap : register(t0);
SamplerState shadowSampler : register(s0);

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

VertexOutput VSMain(VertexInput input)
{
    VertexOutput output;

    output.position = mul(transform, float4(input.position, 1.0f));
    output.normal = input.normal;

    return output;
}

float4 PSMain(VertexOutput input) : SV_TARGET
{
    // Direction of the light
    float3 lightDirection =
        normalize(float3(-1.0f, -0.7f, -0.3f));

    // Diffuse lighting
    float diffuse =
        max(dot(input.normal, -lightDirection), 0.0f);

    // Ambient lighting
    float ambient = 0.25f;

    // Camera/view direction
    float3 viewDirection =
        normalize(float3(0.0f, 0.0f, 3.0f));

    // Reflection direction
    float3 reflection =
        reflect(lightDirection, input.normal);

    // Specular highlight
    float roughness = 0.35f;
    float metallic = 0.0f;

float shininess = lerp(128.0f, 4.0f, roughness);

float specular =
    pow(
        max(dot(viewDirection, reflection), 0.0f),
        shininess
    );

    // Material color
    float3 baseColor =
        float3(0.1f, 0.8f, 0.3f);

    // Combine lighting
    float3 diffuseColor =
    baseColor * (1.0f - metallic);

float3 specularColor =
    lerp(
        float3(1.0f, 1.0f, 1.0f),
        baseColor,
        metallic
    );

float3 finalColor =
    diffuseColor * (ambient + diffuse)
    + specularColor * specular * 0.5f;
    

    return float4(finalColor, 1.0f);
}
// ==========================================
// 🌑 SHADOW MAP VERTEX SHADER
// ==========================================

cbuffer ShadowCameraBuffer : register(b0)
{
    float4x4 shadowTransform;
};

struct ShadowVertexInput
{
    float3 position : POSITION;
    float3 normal   : NORMAL;
};

struct ShadowVertexOutput
{
    float4 position : SV_POSITION;
};

ShadowVertexOutput ShadowVS(ShadowVertexInput input)
{
    ShadowVertexOutput output;

    output.position =
        mul(shadowTransform, float4(input.position, 1.0f));

    return output;
}