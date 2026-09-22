struct VertexInput
{
    float3 position : POSITION;
};

struct VertexOutput
{
    float4 position : SV_POSITION;
};

VertexOutput VSMain(VertexInput input)
{
    VertexOutput output;

    output.position = float4(input.position, 1.0f);

    return output;
}

float4 PSMain(VertexOutput input) : SV_TARGET
{
    return float4(0.1f, 0.8f, 0.3f, 1.0f);
}