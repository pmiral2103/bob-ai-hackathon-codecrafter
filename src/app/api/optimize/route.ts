import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    // action could be 'generate-72h-plan', 'alternate-routing', etc.

    const groqApiKey = process.env.GROQ_API_KEY;

    // If API keys are not set, return a simulated successful response (Demo Mode)
    if (!groqApiKey || groqApiKey === 'your_groq_api_key_here') {
      console.log('Groq API key missing. Using demo fallback response.');
      return NextResponse.json({
        success: true,
        isDemo: true,
        data: {
          recommendation: "Re-route 2 inbound vessels to Pier C. Assign Gantry Q-04 to high-priority unloading. Congestion mitigated by 40%.",
          updatedPlan: "Shift alpha to focus on Yard Block 7 clearance. 72-hour throughput expected to increase.",
          rawInput: payload
        },
        message: "This is a simulated response because GROQ_API_KEY is not set in .env"
      });
    }

    // 1. Prepare the prompt for the Port Optimizer AI
    const prompt = `You are Bob, an AI Port Operations Optimiser.
Current port status:
${JSON.stringify(payload, null, 2)}

Action requested by user: "${action}"

Analyze the request and return ONLY a raw JSON object (without any markdown blocks like \`\`\`json). The JSON must have this exact format:
{
  "reply": "Your conversational, short response to the user explaining what you did.",
  "actionType": "REROUTE" | "UPDATE_CRANE" | "INFO",
  "targetVesselId": "vessel name if applicable, or null",
  "newLocation": "new location if applicable, or null"
}
Make sure your reply is practical and sounds like a smart AI assistant.`;

    // 2. Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b', // Fast and capable model on Groq
        messages: [
          { role: 'system', content: 'You are a port optimization AI. You strictly return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!groqResponse.ok) {
      const errData = await groqResponse.text();
      throw new Error(`Groq API error: ${errData}`);
    }

    const aiData = await groqResponse.json();
    let aiOutput = aiData.choices[0].message.content;
    
    // Clean up potential markdown formatting
    if (aiOutput.startsWith('\`\`\`json')) {
      aiOutput = aiOutput.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    let parsedJson;
    try {
      parsedJson = JSON.parse(aiOutput);
    } catch (e) {
      // Fallback if AI didn't return perfect JSON
      parsedJson = {
        reply: aiOutput,
        actionType: "INFO",
        targetVesselId: null,
        newLocation: null
      };
    }

    return NextResponse.json({
      success: true,
      isDemo: false,
      data: parsedJson
    });

  } catch (error: any) {
    console.error('Error in API /optimize:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
