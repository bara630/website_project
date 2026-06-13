import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Clock, BookOpen, Target, Zap } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickPrompts = [
  { icon: Clock, text: 'How to use Pomodoro?', label: 'Pomodoro Tips' },
  { icon: Target, text: 'Beat procrastination', label: 'Stay Focused' },
  { icon: BookOpen, text: 'Exam preparation', label: 'Study Strategies' },
  { icon: Zap, text: 'Boost productivity', label: 'Productivity' },
];

export default function AIStudyAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI Study Assistant. I can help you with study tips, time management advice, and productivity strategies. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('pomodoro') || lowerMessage.includes('timer')) {
      return "The Pomodoro Technique is great! Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break. This helps maintain focus and prevent burnout.";
    }
    if (lowerMessage.includes('procrastin') || lowerMessage.includes('motivat')) {
      return "To beat procrastination: 1) Break tasks into smaller steps, 2) Use the 2-minute rule (if it takes less than 2 minutes, do it now), 3) Set specific goals with deadlines, 4) Reward yourself after completing tasks.";
    }
    if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
      return "For exam preparation: 1) Start early and space out your study sessions, 2) Use active recall instead of passive reading, 3) Practice with past papers, 4) Get enough sleep the night before - it's crucial for memory consolidation!";
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      return "Managing study stress: 1) Take regular breaks using the Pomodoro technique, 2) Exercise regularly - it reduces cortisol, 3) Practice mindfulness or deep breathing, 4) Remember to maintain a healthy sleep schedule.";
    }
    if (lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      return "Effective scheduling tips: 1) Plan your week every Sunday, 2) Schedule your most important tasks during your peak energy hours, 3) Include buffer time for unexpected tasks, 4) Be realistic about what you can accomplish.";
    }
    if (lowerMessage.includes('focus') || lowerMessage.includes('concentrat')) {
      return "To improve focus: 1) Remove distractions (phone notifications, social media), 2) Create a dedicated study space, 3) Use background music or white noise if it helps, 4) Stay hydrated and keep healthy snacks nearby.";
    }
    if (lowerMessage.includes('note') || lowerMessage.includes('remember')) {
      return "Better note-taking strategies: 1) Use the Cornell method (divide page into sections), 2) Review notes within 24 hours, 3) Use mind maps for complex topics, 4) Summarize information in your own words.";
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Keep up the great work with your studies. Remember, consistency is key to success. Is there anything else I can help you with?";
    }

    return "That's a great question! Based on study science, I'd suggest breaking this down into smaller, manageable tasks and using the Pomodoro technique to maintain focus. Would you like more specific advice on any particular aspect?";
  };

  const handleSendMessage = (text?: string) => {
    const messageToSend = text || inputText;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(messageToSend),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 backdrop-blur-sm bg-opacity-90"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 flex flex-col z-50 transition-all duration-300 ${
            isExpanded ? 'w-[600px] h-[700px]' : 'w-96 h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm p-4 rounded-t-3xl flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Study Assistant</h3>
                <p className="text-xs text-indigo-200">Powered by StudyFlow AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/80 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-4 border-b border-white/10">
            <p className="text-xs text-slate-400 mb-3">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs text-slate-300 transition-all hover:scale-105"
                >
                  <prompt.icon className="w-3 h-3" />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm shadow-lg'
                      : 'bg-white/10 backdrop-blur-sm text-slate-100 rounded-bl-sm border border-white/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm text-slate-100 p-4 rounded-2xl rounded-bl-sm border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about studying..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
