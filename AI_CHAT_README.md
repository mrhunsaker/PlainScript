# AI Chat Integration Guide

## Overview

This document explains the AI chat functionality added to PlainScript and how to configure and extend it.

## Architecture

### Components

1. **AIService** (`ai-service.ts`) - Core service handling AI interactions
   - Manages API communication
   - Handles message context
   - Supports multiple AI providers

2. **AIChatWidget** (`ai-chat-widget.ts`) - React-based UI widget
   - Displays chat messages
   - Handles user input
   - Manages conversation state

3. **AIChatCommandContribution** (`ai-chat-contribution.ts`) - Theia integration
   - Registers the "AI Chat" menu command
   - Creates widget instances
   - Integrates with Theia's command palette

## Features

- ✅ Secondary window for AI chat (separate from main interface)
- ✅ Message history with timestamps
- ✅ User and assistant message distinction
- ✅ Context-aware responses
- ✅ Loading indicator during API calls
- ✅ Keyboard shortcuts (Ctrl+Enter to send)
- ✅ Themeable UI matching your application colors
- ✅ Responsive design

## Opening AI Chat

Users can open the AI Chat in three ways:

1. **View Menu** → View → AI Chat
2. **Command Palette** (Ctrl+Shift+P) → "AI Chat"
3. **Keyboard Shortcut** (can be configured in keybindings)

## Configuration

### Environment Variables

Configure AI API settings using environment variables:

```bash
# Remote API Configuration
export AI_API_ENDPOINT="https://api.openai.com/v1"
export AI_API_KEY="your-api-key-here"
export AI_PROVIDER="openai"  # openai, anthropic, local, custom
export AI_MODEL="gpt-4"
```

### Runtime Configuration

Update the AI service configuration in your code:

```typescript
import { AIService } from './ai-service';

// In a component or service
aiService.setConfig({
    apiEndpoint: 'https://your-api-endpoint.com',
    apiKey: 'your-api-key',
    model: 'your-model-name',
    provider: 'custom',
});
```

## Extending for Different AI Providers

### Option 1: Extend AIService (Recommended)

Create a custom service class:

```typescript
import { AIService, ChatMessage, AIServiceConfig } from './ai-service';
import { injectable } from '@theia/core/shared/inversify';

@injectable()
export class OpenAIService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model: this.config.model || 'gpt-4',
                messages: [
                    ...context,
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}
```

Then update `index.ts`:

```typescript
// Replace the default AIService binding
rebind(AIService).to(OpenAIService).inSingletonScope();
```

### Option 2: Local AI Model

Use a local AI model server:

```typescript
@injectable()
export class LocalAIService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.config.model || 'llama2',
                prompt: userMessage,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error('Local AI Error');
        }

        const data = await response.json();
        return data.response;
    }
}
```

### Option 3: Custom Backend API

Create your own backend endpoint:

```typescript
@injectable()
export class CustomAIService extends AIService {
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        const response = await fetch(`${this.config.apiEndpoint}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
            },
            body: JSON.stringify({
                message: userMessage,
                context: context.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
                model: this.config.model,
                userId: 'user123', // Add any custom fields
            }),
        });

        if (!response.ok) {
            throw new Error('API Error: ' + response.statusText);
        }

        const data = await response.json();
        return data.response || data.message || 'No response received';
    }
}
```

## Popular AI Providers

### OpenAI (ChatGPT)

```typescript
const config = {
    provider: 'openai',
    apiEndpoint: 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
};
```

### Anthropic (Claude)

```typescript
const config = {
    provider: 'anthropic',
    apiEndpoint: 'https://api.anthropic.com/v1',
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-opus-20240229',
};
```

### Local Models (Ollama)

```bash
# Install and run Ollama
ollama run llama2

# Configure in your app
const config = {
    provider: 'local',
    apiEndpoint: 'http://localhost:11434/api',
    model: 'llama2',
};
```

### Groq (Fast Inference)

```typescript
const config = {
    provider: 'custom',
    apiEndpoint: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: 'mixtral-8x7b-32768',
};
```

## Customizing the UI

The chat widget uses CSS variables for theming. Modify colors in `style/ai-chat.less`:

```less
.ai-chat-widget {
    // Change message colors
    .ai-chat-message.user {
        background-color: #0e639c;  // User message background
        color: #ffffff;             // User message text
    }

    .ai-chat-message.assistant {
        background-color: #ececec;  // AI message background
        color: #000000;             // AI message text
    }

    // Change button colors
    .ai-chat-send-btn {
        background-color: #0e639c;
        color: #ffffff;
    }
}
```

## Advanced Features

### Adding System Context

Pass initial context to the chat:

```typescript
// In your application initialization
const systemContext = [
    {
        role: 'assistant',
        content: 'You are a helpful coding assistant. Help the user with their questions about the project.',
    },
];

// Then in sendMessage:
await this.aiService.chat(userMessage, [...systemContext, ...this.messages]);
```

### Custom Message Processing

Override the message sending logic in `AIChatWidget`:

```typescript
protected async sendMessage(): Promise<void> {
    const message = this.inputValue.trim();
    
    // Add custom preprocessing
    const processedMessage = this.preprocessMessage(message);
    
    // ... rest of the method
}

protected preprocessMessage(message: string): string {
    // Add custom logic (e.g., command parsing, context insertion)
    return message;
}
```

### Streaming Responses

Modify `AIService` to support streaming:

```typescript
async *chatStream(userMessage: string, context: ChatMessage[] = []): AsyncIterable<string> {
    const response = await fetch(/* ... */);
    const reader = response.body?.getReader();
    
    while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = new TextDecoder().decode(value);
        yield text;
    }
}
```

## Troubleshooting

### AI Chat not appearing

1. Clear browser cache
2. Rebuild the project: `npm run build`
3. Check console for errors (F12 Developer Tools)

### API Connection Issues

1. Verify API endpoint is correct
2. Check API key is valid
3. Ensure CORS is configured if using remote API
4. Check network connectivity

### Message Not Sending

1. Check that AIService is properly injected
2. Verify AI API is responding
3. Check browser console for errors
4. Ensure message is not empty

## Files Modified/Created

### New Files:
- `src/frontend/ai-chat-widget.ts` - Chat UI component
- `src/frontend/ai-service.ts` - Core AI service
- `src/frontend/ai-chat-contribution.ts` - Theia integration
- `src/frontend/style/ai-chat.less` - Widget styling

### Modified Files:
- `src/frontend/index.ts` - Added AI service bindings

## Next Steps

1. Choose your AI provider and get an API key
2. Set environment variables or configure programmatically
3. Rebuild the project
4. Test the AI Chat widget
5. Customize the UI/UX as needed
6. Extend with your custom features

## Support

For issues or feature requests, refer to the main PlainScript documentation or create an issue in the repository.
