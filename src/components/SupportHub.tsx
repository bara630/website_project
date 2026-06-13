import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Send, ExternalLink, MessageSquare, Book, Mail, X } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I sync my Gmail for reminders?',
    answer: 'Go to Settings > Email Configuration and enter your Gmail credentials. You\'ll need to generate an app password from your Google Account settings for security. Once configured, you can send reminders directly from the dashboard.',
  },
  {
    question: 'How does the Pomodoro timer work?',
    answer: 'The Pomodoro technique uses 25-minute focused work sessions followed by 5-minute breaks. After 4 complete cycles, take a longer 15-30 minute break. This helps maintain focus and prevent burnout.',
  },
  {
    question: 'Can I export my study data?',
    answer: 'Yes! Navigate to Settings > Data Export to download your tasks, exams, and study sessions in CSV format. This is useful for backup or analysis in other tools.',
  },
  {
    question: 'How do I use the AI Study Assistant?',
    answer: 'Click the purple chat bubble in the bottom-right corner. You can ask questions about study techniques, time management, or use the quick prompt buttons for instant tips on common topics.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. All data is stored locally in your browser and encrypted when synced. We never sell your data and comply with GDPR privacy standards.',
  },
];

export default function SupportHub({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Support Hub</h2>
                <p className="text-sm text-indigo-200">Get help with StudyFlow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:bg-white/10 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FAQ Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Book className="w-5 h-5 text-indigo-400" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-200">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/10 mt-2 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Form & Resources */}
            <div className="space-y-6">
              {/* Submit Ticket */}
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  Submit a Ticket
                </h3>
                {ticketSubmitted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
                    <p className="text-emerald-400 font-medium">Ticket submitted successfully!</p>
                    <p className="text-sm text-emerald-300 mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-3">
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Subject"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <textarea
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Describe your issue..."
                      required
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Ticket
                    </button>
                  </form>
                )}
              </div>

              {/* Documentation Links */}
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Book className="w-5 h-5 text-indigo-400" />
                  Documentation
                </h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105 group"
                  >
                    <Book className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                    <span className="text-sm text-slate-300">Getting Started Guide</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105 group"
                  >
                    <Mail className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                    <span className="text-sm text-slate-300">Email Setup Tutorial</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105 group"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                    <span className="text-sm text-slate-300">API Documentation</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>Need immediate help?</p>
            <a href="mailto:support@studyflow.com" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <Mail className="w-4 h-4" />
              support@studyflow.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
