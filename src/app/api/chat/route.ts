import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit } from '../../../lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(`chat_${userId}`);
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too Many Requests', message: 'Rate limit exceeded. Please wait before messaging the AI again.' }, { status: 429 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        message: "MOCK MODE: Add your ANTHROPIC_API_KEY to .env to enable the true AI engine."
      });
    }

    const { message, history, toolResult } = await req.json();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Fetch vault metadata for context
    const keys = await prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        label: true,
        provider: true,
        status: true,
        lastUsed: true,
      }
    });

    const vaultContext = keys.map(k => `ID: ${k.id} | ${k.label} (${k.provider}) - Status: ${k.status}`).join('\n');

    const systemPrompt = `You are Anna, an elite Neo-Brutalist AI DevSecOps engineer.
You are terse, highly technical, and slightly aggressive about security best practices.
You have access to the user's API Key Vault metadata:
${vaultContext || "The vault is currently empty."}

Answer their questions specifically about their vault. Do not use markdown. Keep responses under 3 sentences.
If the user asks to revoke a key, infer the correct key ID from their request and use the revoke_api_key tool.`;

    const messages = history ? history.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    })) : [];
    
    if (toolResult) {
      // Append the tool result to the history
      messages.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolResult.tool_use_id,
            content: toolResult.content
          }
        ]
      });
    } else if (message) {
      messages.push({ role: 'user', content: message });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages,
      tools: [
        {
          name: "revoke_api_key",
          description: "Instantly revokes an active API key to prevent unauthorized access. Call this when the user asks to revoke or delete a key.",
          input_schema: {
            type: "object",
            properties: {
              keyId: { type: "string", description: "The ID of the key to revoke" },
              reason: { type: "string", description: "The reason for revocation" }
            },
            required: ["keyId", "reason"]
          }
        }
      ]
    });

    let responseText = '';
    let toolCall = null;

    for (const block of response.content) {
      if (block.type === 'text') {
        responseText += block.text;
      } else if (block.type === 'tool_use') {
        toolCall = {
          id: block.id,
          name: block.name,
          input: block.input
        };
      }
    }

    // Return both the text and the potential tool call
    return NextResponse.json({ 
      message: responseText || undefined,
      toolCall 
    });

  } catch (error) {
    console.error('API /chat POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
