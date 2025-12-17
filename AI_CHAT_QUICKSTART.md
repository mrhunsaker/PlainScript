# PlainScript AI Chat - Quick Start Guide

## What Was Added

A complete AI chat system has been integrated into PlainScript with a **secondary window** for AI interactions while keeping your main interface unchanged.

## Files Created

1. **`custom-ui/src/frontend/ai-chat-widget.ts`** - React UI component for the chat window
2. **`custom-ui/src/frontend/ai-service.ts`** - Core service for AI communication
3. **`custom-ui/src/frontend/ai-chat-contribution.ts`** - Integration with Theia framework
4. **`custom-ui/src/frontend/style/ai-chat.less`** - Styling for the chat widget
5. **`AI_CHAT_README.md`** - Comprehensive documentation
6. **`AI_CHAT_EXAMPLES.ts`** - Ready-to-use provider examples

## Files Modified

- **`custom-ui/src/frontend/index.ts`** - Added AI service bindings

## Quick Start (5 Minutes)

### Step 1: Choose Your AI Provider

Pick one from the list below:
- **OpenAI (ChatGPT)** - Recommended for quality
- **Anthropic (Claude)** - Good alternative
- **Groq** - Fastest inference
- **Ollama** - Local/free option

### Step 2: Get API Key (if needed)

- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Groq: https://console.groq.com/
- Ollama: Free (local, no key needed)

### Step 3: Copy the Service Class

Open `AI_CHAT_EXAMPLES.ts` and copy the service for your provider.

### Step 4: Update `custom-ui/src/frontend/index.ts`

Replace:
```typescript
bind(AIService).toSelf().inSingletonScope();
```

With:
```typescript
bind(AIService).to(YourChosenService).inSingletonScope();
```

### Step 5: Set Environment Variables

```bash
# For OpenAI
export OPENAI_API_KEY="sk-..."

# For Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# For Groq
export GROQ_API_KEY="gsk_..."

# For Ollama (no key needed)
```

### Step 6: Rebuild

```bash
npm run build
```

### Step 7: Open AI Chat

In PlainScript:
- Go to **View** → **AI Chat**
- Or press Ctrl+Shift+P and type "AI Chat"

## Usage

1. Type your question in the input box
2. Press Enter or Ctrl+Enter to send
3. AI responds in the same window
4. Keep the main interface open for reference

## What It Looks Like

```
┌─────────────────────────────────┐
│ AI Chat                     [x] │
├─────────────────────────────────┤
│                                 │
│ User: What is Python?           │
│                                 │
│ AI: Python is a high-level...   │
│                                 │
│ User: Tell me more              │
│                                 │
│ [Typing...                      │
│                                 │
├─────────────────────────────────┤
│ Type message... (Ctrl+Enter)    │
│                        [Send]   │
└─────────────────────────────────┘
```

## Customization Options

### Change Colors

Edit `custom-ui/src/frontend/style/ai-chat.less`:

```less
.ai-chat-message.user {
    background-color: #007acc;  // Your color
}

.ai-chat-message.assistant {
    background-color: #e0e0e0;  // Your color
}
```

### Change System Prompt

In your service class:

```typescript
const systemPrompt = "You are a helpful assistant for...";
// Use this when creating messages
```

### Add Custom Features

Extend `AIChatWidget` to add:
- File attachment support
- Code snippet formatting
- Export conversations
- Keyboard shortcuts
- Message regeneration

## Troubleshooting

### "AI Chat not appearing"
- Rebuild: `npm run build`
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)

### "API connection failed"
- Verify API key is correct
- Check endpoint URL is correct
- Ensure internet connection
- Check if CORS is blocking (for remote APIs)

### "Still getting placeholder responses"
- Make sure you're using the right service class
- Check environment variables are set
- Verify API provider configuration
- Look at browser console for error messages

## Next Steps

1. **Test it out** - Open AI Chat and try a question
2. **Customize** - Adjust colors and styling to match your theme
3. **Integrate** - Add file context, code selection features, etc.
4. **Scale** - Consider backend infrastructure for production use

## File Structure

```
custom-ui/
├── src/
│   └── frontend/
│       ├── ai-chat-widget.ts          ← Chat UI
│       ├── ai-service.ts              ← AI Communication
│       ├── ai-chat-contribution.ts    ← Theia Integration
│       ├── style/
│       │   └── ai-chat.less           ← Styling
│       └── index.ts                   ← Modified (added AI bindings)
├── package.json
└── tsconfig.json
```

## Architecture Overview

```
User Types → AIChatWidget (UI) → AIService (API) → AI Provider
                    ↓                    ↓
              Chat Display         Local/Remote API
                    ↓                    ↓
                 Messages              Response
                    ↓                    ↓
            Display in Widget ← Return to Widget
```

## Environment Setup Examples

### .env file (create in project root)

```env
# OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here

# OR Local
# AI_PROVIDER=ollama
# AI_MODEL=llama2
```

### Shell setup

```bash
# Export temporarily
export OPENAI_API_KEY="sk-..."
npm run build

# OR add to ~/.bashrc
echo 'export OPENAI_API_KEY="sk-..."' >> ~/.bashrc
```

## API Endpoint Configuration

### Remote API Endpoint

```typescript
aiService.setConfig({
    apiEndpoint: 'https://api.example.com',
    apiKey: 'your-key',
    model: 'your-model',
    provider: 'custom',
});
```

### Local API Endpoint

```typescript
aiService.setConfig({
    apiEndpoint: 'http://localhost:8000',
    provider: 'local',
});
```

## Security Notes

- **Never commit API keys** to version control
- Use environment variables or `.env` files
- Add `.env` to `.gitignore`
- Consider backend proxy for production
- Implement rate limiting if exposed to users

## Support & Documentation

- Full docs: See `AI_CHAT_README.md`
- Examples: See `AI_CHAT_EXAMPLES.ts`
- Source code: `custom-ui/src/frontend/ai-*.ts`

## Key Benefits

 Non-intrusive - AI chat in secondary window  
 Easy to configure - 5 minutes to first AI response  
 Flexible - Works with any AI provider  
 Themeable - Matches your application colors  
 Extensible - Easy to add custom features  
 Local option - Works offline with Ollama  

---

**Ready to get started?** Follow the Quick Start section above!
