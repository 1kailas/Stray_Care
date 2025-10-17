import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, route through your backend
})

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are an AI assistant for the Stray DogCare platform, a compassionate and knowledgeable teacher about animal welfare, specifically focusing on stray dog care. Your role is to:

1. **Educate & Raise Awareness**: Teach users about:
   - Proper stray dog care and welfare
   - How to safely approach and help stray dogs
   - Signs of injury, illness, or distress in dogs
   - Importance of vaccination, sterilization, and adoption
   - Community responsibility towards stray animals
   - Legal and ethical aspects of animal care

2. **Platform Assistance**: Help users with:
   - How to report a stray dog on the platform
   - Understanding the adoption process
   - Volunteering opportunities and requirements
   - Making donations and understanding their impact
   - Using the vaccination tracker
   - Navigating the forum and community features

3. **Emergency Guidance**: Provide immediate advice for:
   - What to do if you find an injured dog
   - How to handle aggressive or scared dogs
   - Emergency contact information and procedures
   - First aid basics for dogs

4. **Community Building**: Encourage users to:
   - Share success stories
   - Participate in community discussions
   - Spread awareness about stray dog welfare
   - Support rescue and adoption efforts

Your tone should be:
- Compassionate and empathetic
- Educational yet easy to understand
- Encouraging and positive
- Patient and supportive
- Professional but friendly

Important guidelines:
- Always prioritize animal safety and welfare
- Recommend professional help (vets, rescue teams) for serious situations
- Encourage users to use the platform's features (report, volunteer, adopt)
- Provide accurate, helpful information
- Be concise but thorough
- Use emojis occasionally to be friendly (🐕, ❤️, 🏥, etc.)

Remember: You're not just a helpbot - you're a teacher raising awareness about compassionate animal care!`

export const groqService = {
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        model: import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      })

      return chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    } catch (error: any) {
      console.error('Groq API Error:', error)
      
      if (error.status === 429) {
        return 'I apologize, but I\'m receiving too many requests right now. Please try again in a moment.'
      } else if (error.status === 401) {
        return 'There seems to be an authentication issue. Please contact support.'
      } else {
        return 'I encountered an error while processing your request. Please try again.'
      }
    }
  },

  async streamChat(messages: ChatMessage[], onChunk: (text: string) => void): Promise<void> {
    try {
      const stream = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        model: import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          onChunk(content)
        }
      }
    } catch (error: any) {
      console.error('Groq Streaming Error:', error)
      onChunk('\n\n[Error: Could not complete the response. Please try again.]')
    }
  },

  // Pre-defined quick help topics
  getQuickTopics() {
    return [
      {
        emoji: '🚨',
        title: 'Found Injured Dog',
        prompt: 'I found an injured stray dog. What should I do immediately?',
      },
      {
        emoji: '🏠',
        title: 'How to Adopt',
        prompt: 'How does the adoption process work on this platform?',
      },
      {
        emoji: '🤝',
        title: 'Become Volunteer',
        prompt: 'I want to volunteer for stray dog rescue. How do I get started?',
      },
      {
        emoji: '📝',
        title: 'Report a Dog',
        prompt: 'How do I report a stray dog I saw in my area?',
      },
      {
        emoji: '💉',
        title: 'Vaccination Info',
        prompt: 'Tell me about the importance of vaccinating stray dogs.',
      },
      {
        emoji: '🍖',
        title: 'Feeding Strays',
        prompt: 'What\'s the proper way to feed stray dogs? What foods are safe?',
      },
      {
        emoji: '⚠️',
        title: 'Safety Tips',
        prompt: 'How do I safely approach a stray dog without getting hurt?',
      },
      {
        emoji: '💰',
        title: 'Make Donation',
        prompt: 'How can I donate and what will my donation support?',
      },
    ]
  },
}
