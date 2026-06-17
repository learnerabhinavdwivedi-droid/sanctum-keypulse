import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit } from '../../../lib/ratelimit';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(`reports_${userId}`);
    if (!rateLimit.success) {
      return NextResponse.json({ 
        overallHealthScore: 0,
        criticalRisks: ["RATE LIMIT EXCEEDED: Too many AI requests. Please wait a moment."],
        actionablePlaybook: []
      }, { status: 429 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("Missing ANTHROPIC_API_KEY. Using mock data.");
      return NextResponse.json({
        overallHealthScore: 85,
        criticalRisks: ["Mock Mode: Missing Anthropic Key"],
        actionablePlaybook: [{ action: "Add ANTHROPIC_API_KEY to .env", priority: "HIGH" }]
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Fetch all keys for the user, EXCLUDING encrypted ciphertexts and IVs
    const keys = await prisma.apiKey.findMany({
      where: { userId },
      select: {
        label: true,
        provider: true,
        status: true,
        lastUsed: true,
        accessScopes: {
          select: { scope: true }
        }
      }
    });

    // Format metadata to pass to Claude
    const metadata = keys.map(k => ({
      label: k.label,
      provider: k.provider,
      status: k.status,
      daysSinceLastUse: Math.floor((new Date().getTime() - new Date(k.lastUsed).getTime()) / (1000 * 3600 * 24)),
      scopes: k.accessScopes.map(s => s.scope)
    }));

    const systemPrompt = `You are an elite, enterprise-grade DevSecOps AI. Analyze the provided API key metadata and access scopes to identify critical security vulnerabilities, rate-limit exposure, privilege escalation risks, and operational inefficiencies.
Return ONLY a valid JSON object matching this exact structure, with no markdown formatting or extra text:
{
  "overallHealthScore": number (0-100, representing enterprise infrastructure integrity),
  "criticalRisks": ["string array of specific, high-level technical risks (e.g., 'Unbounded billing scope on production AWS key')"],
  "actionablePlaybook": [{"action": "string (specific technical remediation)", "priority": "HIGH" | "MEDIUM" | "LOW"}]
}`;

    const userMessage = `Here is the current API infrastructure metadata:
${JSON.stringify(metadata, null, 2)}

Analyze this data and generate the JSON audit report.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage }
      ]
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Attempt to parse JSON safely
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Anthropic response");
    }

    const payload = JSON.parse(jsonMatch[0]);

    return NextResponse.json(payload);

  } catch (error) {
    console.error('API /reports GET Error:', error);
    return NextResponse.json({ 
      overallHealthScore: 0,
      criticalRisks: ["Error generating AI report. Please try again later."],
      actionablePlaybook: []
    }, { status: 500 });
  }
}
