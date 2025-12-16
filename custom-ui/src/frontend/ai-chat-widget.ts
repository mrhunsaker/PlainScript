import './style/ai-chat.less';

import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { injectable, inject } from '@theia/core/shared/inversify';
import { Message } from '@phosphor/messaging';
import * as React from 'react';
import { AIService } from './ai-service';

export const AI_CHAT_WIDGET_FACTORY_ID = 'ai-chat-widget-factory';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

@injectable()
export class AIChatWidget extends ReactWidget {
    static readonly ID = 'ai-chat-widget';
    static readonly LABEL = 'AI Chat';

    @inject(AIService)
    protected aiService!: AIService;

    protected messages: ChatMessage[] = [];
    protected inputValue: string = '';
    protected isLoading: boolean = false;

    constructor() {
        super();
        this.id = AIChatWidget.ID;
        this.title.label = AIChatWidget.LABEL;
        this.title.caption = 'AI Chat Assistant';
        this.title.closable = true;
        this.addClass('ai-chat-widget');
    }

    protected render(): React.ReactNode {
        return React.createElement('div', { className: 'ai-chat-container' },
            // Messages area
            React.createElement('div', { className: 'ai-chat-messages' },
                this.messages.map((msg) =>
                    React.createElement('div', 
                        { 
                            key: msg.id, 
                            className: `ai-chat-message ${msg.role}` 
                        },
                        React.createElement('div', { className: 'ai-chat-message-role' }, msg.role),
                        React.createElement('div', { className: 'ai-chat-message-content' }, msg.content),
                        React.createElement('div', { className: 'ai-chat-message-time' }, 
                            msg.timestamp.toLocaleTimeString()
                        )
                    )
                )
            ),
            // Loading indicator
            this.isLoading && React.createElement('div', { className: 'ai-chat-loading' },
                React.createElement('div', { className: 'ai-chat-loading-spinner' })
            ),
            // Input area
            React.createElement('div', { className: 'ai-chat-input-area' },
                React.createElement('textarea', {
                    className: 'ai-chat-input',
                    value: this.inputValue,
                    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        this.inputValue = e.currentTarget.value;
                        this.update();
                    },
                    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                            this.sendMessage();
                        }
                    },
                    placeholder: 'Type your message here... (Ctrl+Enter to send)',
                    disabled: this.isLoading,
                }),
                React.createElement('button', {
                    className: 'ai-chat-send-btn',
                    onClick: () => this.sendMessage(),
                    disabled: this.isLoading || !this.inputValue.trim(),
                }, 'Send')
            )
        );
    }

    protected async sendMessage(): Promise<void> {
        const message = this.inputValue.trim();
        if (!message) {
            return;
        }

        // Add user message
        const userMessageId = `msg-${Date.now()}`;
        this.messages.push({
            id: userMessageId,
            role: 'user',
            content: message,
            timestamp: new Date(),
        });

        this.inputValue = '';
        this.isLoading = true;
        this.update();

        try {
            // Get AI response
            const response = await this.aiService.chat(message, this.messages.slice(0, -1));

            // Add AI response
            this.messages.push({
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error('AI Chat Error:', error);
            this.messages.push({
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                timestamp: new Date(),
            });
        } finally {
            this.isLoading = false;
            this.update();

            // Auto-scroll to bottom
            setTimeout(() => {
                const messagesContainer = this.node.querySelector('.ai-chat-messages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 0);
        }
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const input = this.node.querySelector('.ai-chat-input') as HTMLTextAreaElement;
        if (input) {
            input.focus();
        }
    }
}
