import { useState, useEffect } from 'react';
import { Timer, CheckSquare, Calendar, Plus, Trash2, LogIn, LogOut, User, HelpCircle } from 'lucide-react';
import CalendarView from './components/CalendarView';
import WorkloadAnalyzer from './components/WorkloadAnalyzer';
import AIStudyAssistant from './components/AIStudyAssistant';
import SupportHub from './components/SupportHub';

const API_URL = 'http://localhost:8080/api';

interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  estimatedPomodoros?: number;
}

interface Exam {
  id: number;
  userId: number;
  courseName: string;
  examDate: string;
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  // Support Hub State
  const [showSupport, setShowSupport] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Exam State
  const [exams, setExams] = useState<Exam[]>([]);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
    fetchExams();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_URL}/exams`);
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          title: newTaskTitle,
          completed: false,
          dueDate: newTaskDueDate || null,
        }),
      });
      
      if (response.ok) {
        setNewTaskTitle('');
        setNewTaskDueDate('');
        fetchTasks();
        showToast('Task added successfully!', 'success');
      } else {
        showToast('Failed to add task', 'error');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: 'PUT',
      });
      fetchTasks();
      showToast('Task status updated!', 'success');
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
      showToast('Task deleted!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    console.log('Login button clicked, email:', userEmail);
    
    if (!userEmail.trim()) {
      showToast('Please enter an email', 'error');
      return;
    }

    if (!isValidEmail(userEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (!userPassword.trim()) {
      showToast('Please enter a password', 'error');
      return;
    }
    
    try {
      console.log('Attempting login to backend...');
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      if (data.success) {
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        console.log('Login failed, using demo mode');
        setIsAuthenticated(true);
        setShowLogin(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      // For demo, allow login even if backend fails
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    setUserEmail('');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Pomodoro timer effect
  useEffect(() => {
    let timer: number;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatExamDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilExam = (dateString: string) => {
    const examDate = new Date(dateString);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans animate-fade-in">
      {/* Login Form */}
      {showLogin && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                Welcome to StudyFlow
              </h1>
              <p className="text-slate-400">Sign in to manage your study goals</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your email"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            </div>
            <p className="text-center text-slate-500 text-sm mt-6">
              Enter your email and password to continue
            </p>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      {!showLogin && (
        <>
          <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                StudyFlow Dashboard
              </h1>
              <p className="text-slate-400">Welcome back! Time to manage your study goals effectively.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSupport(true)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm">Support</span>
              </button>
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-5 h-5" />
                <span className="text-sm">{userEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pomodoro Component */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Timer className="text-blue-400 w-6 h-6" />
                <h2 className="text-xl font-semibold">Pomodoro Timer</h2>
              </div>
              <div className="text-5xl font-mono font-bold my-4 text-white bg-slate-900 px-6 py-3 rounded-xl border border-slate-700">
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full py-2.5 rounded-xl font-semibold transition-colors ${
                  isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isRunning ? 'Pause' : 'Start Focus Session'}
              </button>
            </div>

            {/* Task Tracker Component */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="text-indigo-400 w-6 h-6" />
                <h2 className="text-xl font-semibold">Assignments & Tasks</h2>
              </div>
              
              {/* Add Task Input */}
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add new task..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  placeholder="Due date (optional)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addTask}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Add Task
                </button>
              </div>

              {/* Task List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {tasks.filter(task => !task.completed).length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No tasks yet. Add one above!</p>
                ) : (
                  tasks.filter(task => !task.completed).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-700 group"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="flex-1 text-slate-300">
                        {task.title}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Exam Countdowns */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-emerald-400 w-6 h-6" />
                <h2 className="text-xl font-semibold">Exam Countdown</h2>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {exams.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No exams scheduled.</p>
                ) : (
                  exams.map((exam) => (
                    <div key={exam.id} className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{exam.courseName}</p>
                        <p className="text-xs text-slate-500">{formatExamDate(exam.examDate)}</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-sm font-semibold">
                        {getDaysUntilExam(exam.examDate)} Days Left
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* New Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <CalendarView tasks={tasks} exams={exams} />
            <WorkloadAnalyzer tasks={tasks} exams={exams} />
          </div>

          {/* AI Study Assistant */}
          <AIStudyAssistant />

          {/* Support Hub */}
          <SupportHub isOpen={showSupport} onClose={() => setShowSupport(false)} />

          {/* Toast Notification */}
          {toast && (
            <div
              className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 transform ${
                toast.type === 'success'
                  ? 'bg-emerald-500/90 border-emerald-400/30 text-white'
                  : 'bg-red-500/90 border-red-400/30 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium">{toast.message}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
