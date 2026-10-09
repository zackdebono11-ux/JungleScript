
cbuffer CameraBuffer : register(b0)
{
    float4x4 transform;
    float4x4 lightTransform;
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
    float4 position     : SV_POSITION;
    float3 normal       : TEXCOORD0;
    float4 lightPosition : TEXCOORD1;
};

VertexOutput VSMain(VertexInput input)
{
    VertexOutput output;

    float4 worldPosition = float4(input.position, 1.0f);

    output.position = mul(transform, worldPosition);
    output.lightPosition = mul(lightTransform, worldPosition);

    // The cube is rotated in the current model matrix.
    // This is a basic normal transform for the current rotation-only model.
    output.normal = normalize(input.normal);

    return output;
}

float CalculateShadow(float4 lightPosition)
{
    // Avoid sampling when the position is behind the light camera.
    if (lightPosition.w <= 0.0f)
    {
        return 1.0f;
    }

    // Convert from light clip space to normalized device coordinates.
    float3 lightNdc = lightPosition.xyz / lightPosition.w;

    // Outside the light's depth range means it receives no shadow.
    if (lightNdc.z < 0.0f || lightNdc.z > 1.0f)
    {
        return 1.0f;
    }

    // Convert clip-space XY into texture coordinates.
    float2 shadowUV;
    shadowUV.x = lightNdc.x * 0.5f + 0.5f;
    shadowUV.y = 0.5f - lightNdc.y * 0.5f;

    // Outside the shadow map means fully lit.
    if (shadowUV.x < 0.0f || shadowUV.x > 1.0f ||
        shadowUV.y < 0.0f || shadowUV.y > 1.0f)
    {
        return 1.0f;
    }

    // Read the nearest stored light depth.
    float storedDepth = shadowMap.Sample(
        shadowSampler,
        shadowUV
    ).r;

    // Small depth bias helps reduce self-shadowing.
    float bias = 0.003f;

    // 1 = lit, 0 = shadowed.
    return (lightNdc.z - bias <= storedDepth) ? 1.0f : 0.0f;
}

float4 PSMain(VertexOutput input) : SV_TARGET
{
    float3 normal = normalize(input.normal);

    float3 lightDirection =
        normalize(float3(-1.0f, -0.7f, -0.3f));

    float diffuse =
        max(dot(normal, -lightDirection), 0.0f);

    float ambient = 0.25f;

    float shadow = CalculateShadow(input.lightPosition);

    float3 viewDirection =
        normalize(float3(0.0f, 0.0f, 3.0f));

    float3 reflection =
        reflect(lightDirection, normal);

    float roughness = 0.35f;
    float metallic = 0.0f;

    float shininess = lerp(128.0f, 4.0f, roughness);

    float specular =
        pow(
            max(dot(viewDirection, reflection), 0.0f),
            shininess
        );

    float3 baseColor = float3(0.1f, 0.8f, 0.3f);

    float3 diffuseColor = baseColor * (1.0f - metallic);

    float3 specularColor =
        lerp(
            float3(1.0f, 1.0f, 1.0f),
            baseColor,
            metallic
        );

    // Shadows reduce direct diffuse and specular light,
    // while ambient illumination remains.
    float3 finalColor =
        diffuseColor * (ambient + diffuse * shadow)
        + specularColor * specular * shadow * 0.5f;

    return float4(finalColor, 1.0f);
}

// ==========================================
// SHADOW MAP VERTEX SHADER
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
