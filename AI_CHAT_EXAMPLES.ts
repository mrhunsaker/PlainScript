/**
 * QUICK START EXAMPLES FOR AI CHAT INTEGRATION
 * 
 * Copy and adapt these examples for your specific AI provider
 */

// ============================================================================
// EXAMPLE 1: OpenAI Integration (ChatGPT)
// ============================================================================

import { AIService, ChatMessage } from './ai-service';
import { injectable } from '@theia/core/shared/inversify';

@injectable()
export class OpenAIChatService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const messages = [
            ...context.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage,
            },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model: this.config.model || 'gpt-4',
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response';
    }
}

// Usage in index.ts:
// rebind(AIService).to(OpenAIChatService).inSingletonScope();
// Environment: export OPENAI_API_KEY="sk-..."


// ============================================================================
// EXAMPLE 2: Anthropic Integration (Claude)
// ============================================================================

@injectable()
export class AnthropicChatService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const messages = [
            ...context.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage,
            },
        ];

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': this.config.apiKey || '',
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: this.config.model || 'claude-3-opus-20240229',
                max_tokens: 2000,
                messages: messages,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Anthropic Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.content[0]?.text || 'No response';
    }
}

// Usage: rebind(AIService).to(AnthropicChatService).inSingletonScope();
// Environment: export ANTHROPIC_API_KEY="sk-ant-..."


// ============================================================================
// EXAMPLE 3: Local AI with Ollama
// ============================================================================

@injectable()
export class OllamaChatService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const messages = [
            ...context.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage,
            },
        ];

        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.config.model || 'llama2',
                messages: messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.statusText}. Make sure Ollama is running on localhost:11434`);
        }

        const data = await response.json();
        return data.message?.content || 'No response';
    }
}

// Usage: rebind(AIService).to(OllamaChatService).inSingletonScope();
// Setup: ollama pull llama2 && ollama serve


// ============================================================================
// EXAMPLE 4: Groq Integration (Fast Open-Source Models)
// ============================================================================

@injectable()
export class GroqChatService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const messages = [
            ...context.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user',
                content: userMessage,
            },
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.config.model || 'mixtral-8x7b-32768',
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Groq Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response';
    }
}

// Usage: rebind(AIService).to(GroqChatService).inSingletonScope();
// Environment: export GROQ_API_KEY="gsk_..."


// ============================================================================
// EXAMPLE 5: Custom Backend Integration
// ============================================================================

@injectable()
export class CustomBackendChatService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const response = await fetch(`${this.config.apiEndpoint}/v1/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                }),
            },
            body: JSON.stringify({
                message: userMessage,
                history: context,
                model: this.config.model,
                metadata: {
                    timestamp: new Date().toISOString(),
                    source: 'plainscript-ai-chat',
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Backend Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response || data.message || 'No response';
    }
}

// Usage: rebind(AIService).to(CustomBackendChatService).inSingletonScope();
// Environment: export AI_API_ENDPOINT="http://your-backend.com"


// ============================================================================
// EXAMPLE 6: Using Environment Variables in index.ts
// ============================================================================

/*
export default new ContainerModule((bind, unbind, isBound, rebind) => {
    // ... other bindings ...

    // AI Configuration from environment
    const aiProvider = process.env.AI_PROVIDER || 'openai';
    
    const aiServiceClass = {
        'openai': OpenAIChatService,
        'anthropic': AnthropicChatService,
        'ollama': OllamaChatService,
        'groq': GroqChatService,
        'custom': CustomBackendChatService,
    }[aiProvider] || OpenAIChatService;

    rebind(AIService).to(aiServiceClass).inSingletonScope();
    
    bind(AIChatWidget).toSelf();
    bind(WidgetFactory).toDynamicValue((container) => ({
        id: AIChatWidget.ID,
        createWidget: () => container.get(AIChatWidget),
    })).inSingletonScope();
    
    initAIChatContribution({ bind });
    
    // ... rest of bindings ...
});
*/


// ============================================================================
// EXAMPLE 7: Configuration via .env file
// ============================================================================

/*
Create a .env file in your project root:

# OpenAI
AI_PROVIDER=openai
AI_MODEL=gpt-4
OPENAI_API_KEY=sk-your-key-here

# OR Anthropic
# AI_PROVIDER=anthropic
# AI_MODEL=claude-3-opus-20240229
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# OR Local (Ollama)
# AI_PROVIDER=ollama
# AI_MODEL=llama2

# Custom endpoint (if using custom backend)
# AI_API_ENDPOINT=http://your-backend.com
# AI_API_KEY=your-api-key
*/


// ============================================================================
// EXAMPLE 8: Testing Your Integration
// ============================================================================

/*
Test code to verify your AI integration:

async function testAIChat() {
    const aiService = new OpenAIChatService({
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4',
    });
    
    try {
        const response = await aiService.chat('Hello, how are you?', []);
        console.log('AI Response:', response);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testAIChat();
*/


// ============================================================================
// EXAMPLE 9: Adding System Prompts
// ============================================================================

@injectable()
export class SystemPromptChatService extends AIService {
    private systemPrompt = `You are a helpful coding assistant integrated into PlainScript IDE. 
You help users with:
- Code writing and debugging
- Best practices and design patterns
- Architecture recommendations
- Testing strategies

Always provide concise, actionable responses with code examples when relevant.`;

    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        // Add system prompt to the beginning of context
        const messagesWithSystem = [
            { role: 'system' as const, content: this.systemPrompt },
            ...context.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: 'user' as const,
                content: userMessage,
            },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model: this.config.model || 'gpt-4',
                messages: messagesWithSystem,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response';
    }
}


// ============================================================================
// SETUP INSTRUCTIONS BY PROVIDER
// ============================================================================

/*

OPENAI (ChatGPT):
1. Get API key from https://platform.openai.com/api-keys
2. Set environment variable: export OPENAI_API_KEY="sk-..."
3. Use OpenAIChatService

ANTHROPIC (Claude):
1. Get API key from https://console.anthropic.com/
2. Set environment variable: export ANTHROPIC_API_KEY="sk-ant-..."
3. Use AnthropicChatService

OLLAMA (Local):
1. Download Ollama from https://ollama.ai
2. Run: ollama pull llama2
3. Run: ollama serve
4. Use OllamaChatService (connects to localhost:11434)

GROQ:
1. Get API key from https://console.groq.com/
2. Set environment variable: export GROQ_API_KEY="gsk_..."
3. Use GroqChatService

CUSTOM BACKEND:
1. Deploy your backend
2. Set API endpoint and key
3. Use CustomBackendChatService
*/
