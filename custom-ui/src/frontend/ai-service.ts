import { injectable } from '@theia/core/shared/inversify';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface AIServiceConfig {
    apiEndpoint?: string;
    apiKey?: string;
    model?: string;
    provider?: 'openai' | 'anthropic' | 'local' | 'custom';
}

/**
 * Base AI Service for handling chat interactions.
 * Extend this class to implement different AI providers (OpenAI, Anthropic, Local, etc.)
 */
@injectable()
export class AIService {
    protected config: AIServiceConfig;

    constructor(config?: AIServiceConfig) {
        this.config = config || this.getDefaultConfig();
    }

    /**
     * Send a message to the AI and get a response
     */
    async chat(userMessage: string, context: ChatMessage[] = []): Promise<string> {
        // Default implementation - returns a placeholder response
        // Override this method in subclasses for actual AI integration
        return this.handleMessage(userMessage, context);
    }

    /**
     * Get configuration from environment or use defaults
     */
    protected getDefaultConfig(): AIServiceConfig {
        return {
            provider: 'local',
            model: 'default',
            apiEndpoint: process.env.AI_API_ENDPOINT || 'http://localhost:8000/api',
            apiKey: process.env.AI_API_KEY || '',
        };
    }

    /**
     * Handle the actual message - can be overridden for different implementations
     */
    protected async handleMessage(userMessage: string, context: ChatMessage[]): Promise<string> {
        try {
            // Try to connect to API endpoint
            if (this.config.apiEndpoint && this.config.provider !== 'local') {
                return await this.callRemoteAPI(userMessage, context);
            }

            // Fallback to local/placeholder implementation
            return this.generateLocalResponse(userMessage, context);
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Call a remote AI API
     */
    protected async callRemoteAPI(userMessage: string, context: ChatMessage[]): Promise<string> {
        const response = await fetch(`${this.config.apiEndpoint}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
            },
            body: JSON.stringify({
                message: userMessage,
                context: context,
                model: this.config.model,
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response || data.message || 'No response received';
    }

    /**
     * Generate a local response (placeholder implementation)
     */
    protected generateLocalResponse(userMessage: string, context: ChatMessage[]): string {
        // Simple echo-based response - replace with actual logic
        const wordCount = userMessage.split(' ').length;
        const contextInfo = context.length > 0 ? ` (with ${context.length} context messages)` : '';
        
        return `I received your message with ${wordCount} words${contextInfo}. ` +
               `To enable AI features, configure an API endpoint in your settings. ` +
               `You can also extend the AIService class to integrate with your preferred AI provider.`;
    }

    /**
     * Update the service configuration
     */
    setConfig(config: Partial<AIServiceConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Get current configuration
     */
    getConfig(): AIServiceConfig {
        return { ...this.config };
    }
}
