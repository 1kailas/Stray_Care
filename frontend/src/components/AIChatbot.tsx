import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, Send, Bot, User, Sparkles, 
  HelpCircle, BookOpen, X, Minimize2, Maximize2 
} from 'lucide-react'
import { groqService, type ChatMessage } from '@/services/groqService'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth'

interface Message extends ChatMessage {
  id: string
  timestamp: Date
  isStreaming?: boolean
}

export function AIChatbot() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hello${user ? `, ${user.name}` : ''}! I'm your AI guide for Stray DogCare. I'm here to teach you about animal welfare and help you navigate the platform.\n\n🐕 How can I assist you today? You can ask me about:\n- Caring for stray dogs\n- Reporting or adopting dogs\n- Volunteering opportunities\n- Emergency situations\n- Platform features\n\nOr choose a quick topic below!`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickTopics = groqService.getQuickTopics()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Auto-focus input when chat opens or after sending message
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isMinimized, messages.length])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Re-focus input after state update
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)

    // Create assistant message placeholder for streaming
    const assistantId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      // Use streaming for better UX
      await groqService.streamChat(
        messages.map(m => ({ role: m.role, content: m.content })).concat([
          { role: 'user', content: content.trim() },
        ]),
        (chunk) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, content: m.content + chunk, isStreaming: true }
                : m
            )
          )
        }
      )

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      )
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to get response. Please try again.')
      
      // Remove the failed message
      setMessages(prev => prev.filter(m => m.id !== assistantId))
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickTopic = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Chat cleared! 🧹\n\nHow can I help you learn about stray dog care today?`,
        timestamp: new Date(),
      },
    ])
    toast.success('Chat history cleared')
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        size="icon"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
        </span>
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 shadow-2xl transition-all z-50 ${
        isMinimized ? 'h-16' : 'h-[600px]'
      }`}
    >
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarFallback className="bg-primary text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-1">
                AI Care Guide
                <Sparkles className="w-4 h-4 text-primary" />
              </CardTitle>
              <CardDescription className="text-xs">
                Your stray dog welfare teacher
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex flex-col h-[calc(600px-140px)]">
            {/* Quick Topics */}
            {messages.length <= 2 && (
              <div className="p-3 border-b bg-muted/30">
                <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                  <HelpCircle className="w-3 h-3" />
                  <span>Quick Topics</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickTopics.slice(0, 4).map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto py-2 px-2 text-xs justify-start"
                      onClick={() => handleQuickTopic(topic.prompt)}
                      disabled={isLoading}
                    >
                      <span className="mr-1">{topic.emoji}</span>
                      <span className="truncate">{topic.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback
                        className={
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-white'
                        }
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex-1 space-y-1 ${
                        message.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`inline-block px-3 py-2 rounded-lg text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-xs text-muted-foreground px-1 ${
                          message.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* More Quick Topics */}
            {messages.length > 2 && (
              <div className="border-t p-2 bg-muted/30">
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
                  {quickTopics.slice(0, 6).map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs whitespace-nowrap flex-shrink-0"
                      onClick={() => handleQuickTopic(topic.prompt)}
                      disabled={isLoading}
                    >
                      <span className="mr-1">{topic.emoji}</span>
                      {topic.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="border-t p-3 bg-background">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about dog care..."
                  disabled={isLoading}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {messages.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={clearChat}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <Button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                Powered by Groq AI
              </Badge>
              <Badge variant="outline" className="text-xs">
                <MessageSquare className="w-3 h-3 mr-1" />
                {messages.length} messages
              </Badge>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
