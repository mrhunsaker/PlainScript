# AI Chat Implementation - Visual Reference

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PlainScript IDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐    ┌──────────────────────────┐   │
│  │   Main Editor View   │    │   AI Chat Window (NEW)   │   │
│  │  (Unchanged - Your   │    │                          │   │
│  │   code goes here)    │    │ ┌──────────────────────┐ │   │
│  │                      │    │ │ Messages Display     │ │   │
│  │  [Files here]        │    │ │ - Scrollable         │ │   │
│  │  [Code here]         │    │ │ - Timestamped        │ │   │
│  │  [Terminal here]     │    │ │ - Color-coded        │ │   │
│  │                      │    │ └──────────────────────┘ │   │
│  │                      │    │ ┌──────────────────────┐ │   │
│  │                      │    │ │ Input Area           │ │   │
│  │                      │    │ │ [Type here...      ] │ │   │
│  │                      │    │ │        [Send Button] │ │   │
│  │                      │    │ └──────────────────────┘ │   │
│  │                      │    │  Ctrl+Enter to send      │   │
│  └──────────────────────┘    └──────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Message Flow

```
User Input
    ↓
AIChatWidget.sendMessage()
    ↓
Add message to UI
Mark as loading
    ↓
AIService.chat(message, context)
    ↓
Determine Provider (config)
    ↓
┌─────────────────────────────────┐
│   Remote Provider               │
│ - OpenAI                        │
│ - Anthropic                     │
│ - Groq                          │
│ - Custom Backend                │
└─────────────────┬───────────────┘
                  │
                  ↓ HTTP Request
            AI API Server
                  │
                  ↓ Response
                  │
┌─────────────────────────────────┐
│   Local Provider                │
│ - Ollama (local model)          │
│ - Fallback placeholder          │
└─────────────────┬───────────────┘
                  │
                  ↓
        Format Response
                  │
                  ↓
        Display in Widget
                  ↓
        User sees AI reply
```

## Component Relationships

```
┌────────────────────────────────────────────────────────┐
│  custom-ui/src/frontend/index.ts (Container Setup)     │
│                                                        │
│  - Binds AIService implementation                      │
│  - Creates AIChatWidget factory                        │
│  - Registers AIChatCommandContribution                 │ 
└────────────────────┬───────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ↓            ↓            ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
│ AIService    │ │AIChatWidget  │ │AIChatCommand     │
│              │ │              │ │Contribution      │
│- chat()      │ │- UI Display  │ │                  │
│- Config      │ │- Message     │ │- Register        │
│- API Call    │ │  Management  │ │  Commands        │
│              │ │- User Input  │ │- Menu Items      │
└──────────────┘ └──────────────┘ └──────────────────┘
                     │
                     ↓
           View → AI Chat window
           Menu → AI Chat option
           Command Palette → AI Chat
```

## File Structure & Responsibility

```
custom-ui/src/frontend/
│
├── ai-chat-widget.ts
│   ├── React Component for UI
│   ├── Manages chat messages
│   ├── Handles user input
│   └── Injects AIService for responses
│
├── ai-service.ts
│   ├── Base service class
│   ├── API communication logic
│   ├── Config management
│   └── Error handling
│
├── ai-chat-contribution.ts
│   ├── Theia integration
│   ├── Command registration
│   ├── Menu registration
│   └── Widget creation handler
│
├── style/ai-chat.less
│   ├── Widget styling
│   ├── Message display styles
│   ├── Input area styles
│   └── Responsive design
│
└── index.ts (MODIFIED)
    ├── Binds AIService
    ├── Registers AIChatWidget
    ├── Registers CommandContribution
    └── Initializes module
```

## Configuration Flow

```
CONFIGURATION HIERARCHY (Top → Bottom Priority):

┌─────────────────────────────────┐
│   Runtime Configuration         │
│ aiService.setConfig({...})      │
│ (Highest Priority)              │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Environment Variables          │
│  process.env.AI_*               │
│  process.env.OPENAI_API_KEY     │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Constructor Config             │
│  new AIService(config)          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Defaults                       │
│ {provider: 'local', ...}        │
│ (Lowest Priority)               │
└─────────────────────────────────┘
```

## Adding New AI Provider - Step by Step

```
STEP 1: Create Service Class
┌──────────────────────────────────────┐
│  class MyAIChatService extends       │
│    AIService {                       │
│    protected async handleMessage()   │
│  }                                   │
└──────────────────────────────────────┘

STEP 2: Implement handleMessage()
┌──────────────────────────────────────┐
│  - Format messages for provider      │
│  - Make API call                     │
│  - Parse response                    │
│  - Handle errors                     │
│  - Return string response            │
└──────────────────────────────────────┘

STEP 3: Update index.ts
┌──────────────────────────────────────┐
│  rebind(AIService)                   │
│    .to(MyAIChatService)              │
│    .inSingletonScope()               │
└──────────────────────────────────────┘

STEP 4: Set Configuration
┌──────────────────────────────────────┐
│  export MY_PROVIDER_API_KEY="..."    │
│  export AI_MODEL="model-name"        │
└──────────────────────────────────────┘

STEP 5: Test
┌──────────────────────────────────────┐
│  npm run build                       │
│  Open App → View → AI Chat           │
│  Type message → Verify response      │
└──────────────────────────────────────┘
```

## Theme Customization Guide

```
AI Chat Widget Colors:

USER MESSAGES:
┌─────────────────────────────────┐
│ .ai-chat-message.user           │
│ ├─ background-color             │
│ │  (Current: #0e639c - Blue)  │
│ └─ color                        │
│    (Current: #ffffff - White) │
└─────────────────────────────────┘

AI MESSAGES:
┌─────────────────────────────────┐
│ .ai-chat-message.assistant      │
│ ├─ background-color             │
│ │  (Current: #ececec - Light) │
│ └─ color                        │
│    (Current: #000000 - Black) │
└─────────────────────────────────┘

BUTTONS:
┌─────────────────────────────────┐
│ .ai-chat-send-btn               │
│ ├─ background-color             │
│ ├─ color                        │
│ └─ hover & active states        │
└─────────────────────────────────┘

INPUT:
┌─────────────────────────────────┐
│ .ai-chat-input                  │
│ ├─ border-color                 │
│ ├─ background-color             │
│ └─ focus state                  │
└─────────────────────────────────┘
```

## Deployment Considerations

```
LOCAL DEPLOYMENT (Testing)
├─ Ollama (Free, Local)
│  └─ No API key needed
│  └─ Runs on localhost:11434
│  └─ Best for development
│
PRODUCTION DEPLOYMENT
├─ Remote API (Recommended)
│  ├─ OpenAI ($$)
│  ├─ Anthropic ($$)
│  ├─ Groq ($)
│  └─ Your own backend
│
├─ Security
│  ├─ Use environment variables
│  ├─ Don't commit API keys
│  ├─ Implement rate limiting
│  └─ Use backend proxy for security
│
└─ Scaling
   ├─ Backend queue system
   ├─ Rate limit per user
   ├─ Cost tracking
   └─ Model switching (fallback)
```

## Browser DevTools Debugging

```
CHECKING CONFIGURATION:
F12 → Console → Type:
  > console.log(aiService.getConfig())

CHECKING API CALLS:
F12 → Network Tab → Send message
  - Look for API requests
  - Check response status
  - Verify headers/auth

CHECKING ERRORS:
F12 → Console → Errors section
  - API connection issues
  - Configuration problems
  - Missing dependencies

CHECKING PERFORMANCE:
F12 → Performance Tab
  - Measure chat response time
  - Check UI re-render frequency
```

## Integration Points

```
External Systems That Can Connect:

1. CODE EDITOR CONTEXT
   └─ Selected code → AI Chat
      Example: Right-click selection → "Ask AI"

2. FILE SYSTEM
   └─ Open files → AI can reference
      Example: "Review my current file"

3. TERMINAL OUTPUT
   └─ Error logs → AI Chat
      Example: "Fix this error"

4. SETTINGS/CONFIG
   └─ User preferences
      Example: "Code style guidelines"

5. CUSTOM EXTENSIONS
   └─ Your plugins can call AI
      Example: "Generate documentation"
```

## Common Scenarios

```
SCENARIO 1: Question About Code
├─ User opens a code file
├─ User selects some code
├─ User asks "What does this do?"
└─ AI explains in chat

SCENARIO 2: Debug Error
├─ User gets error in terminal
├─ User copies error to AI chat
├─ AI suggests fixes
└─ User implements suggestion

SCENARIO 3: Code Generation
├─ User describes what they want
├─ AI generates code in chat
├─ User copies to editor
└─ User refines as needed

SCENARIO 4: Learning
├─ User asks for explanations
├─ AI provides detailed answers
├─ User asks follow-up questions
└─ Conversation builds context
```

---

This visual reference should help you understand how the AI chat system works and integrates with PlainScript!
