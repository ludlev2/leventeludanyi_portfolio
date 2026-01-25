import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { executeCommand, getCommandSuggestions, type CommandResult } from './commands';
import { WELCOME_MESSAGE } from './ascii-art';

interface HistoryEntry {
  command: string;
  output: string;
  isHtml?: boolean;
}

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Toggle terminal
  const toggleTerminal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Listen for toggle events
  useEffect(() => {
    const handleToggle = () => toggleTerminal();
    window.addEventListener('toggle-terminal', handleToggle);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('toggle-terminal', handleToggle);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, toggleTerminal]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();

      // Show welcome message on first open
      if (history.length === 0) {
        setHistory([{ command: '', output: WELCOME_MESSAGE }]);
      }
    }
  }, [isOpen, history.length]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Update suggestions
  useEffect(() => {
    if (input) {
      const suggestions = getCommandSuggestions(input);
      if (suggestions.length > 0 && suggestions[0] !== input) {
        setSuggestion(suggestions[0]);
      } else {
        setSuggestion('');
      }
    } else {
      setSuggestion('');
    }
  }, [input]);

  // Handle command execution
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const result: CommandResult = executeCommand(trimmedInput);

    // Add to command history
    setCommandHistory((prev) => [...prev, trimmedInput]);
    setHistoryIndex(-1);

    // Handle special actions
    if (result.action === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (result.action === 'exit') {
      setHistory((prev) => [
        ...prev,
        { command: trimmedInput, output: result.output },
      ]);
      setTimeout(() => setIsOpen(false), 500);
      setInput('');
      return;
    }

    if (result.action === 'navigate' && result.actionPayload) {
      setHistory((prev) => [
        ...prev,
        { command: trimmedInput, output: result.output },
      ]);
      setTimeout(() => {
        if (result.actionPayload?.startsWith('http')) {
          window.open(result.actionPayload, '_blank');
        } else {
          window.location.href = result.actionPayload!;
        }
      }, 300);
      setInput('');
      return;
    }

    if (result.action === 'theme' && result.actionPayload) {
      const isDark = result.actionPayload === 'dark';
      document.documentElement.classList.toggle('light', !isDark);
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', result.actionPayload);
    }

    // Add to history
    setHistory((prev) => [
      ...prev,
      {
        command: trimmedInput,
        output: result.output,
        isHtml: result.isHtml,
      },
    ]);

    setInput('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1
          ? historyIndex + 1
          : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion('');
      }
    }
  };

  // Render output - HTML output is from our own trusted command responses
  const renderOutput = (entry: HistoryEntry) => {
    if (entry.isHtml) {
      // Safe: HTML comes from hardcoded command responses in commands.ts
      return <div dangerouslySetInnerHTML={{ __html: entry.output }} />;
    }
    return entry.output;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Terminal window */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative w-full max-w-3xl h-[70vh] sm:h-[60vh] bg-bg-terminal border border-text-muted/20 rounded-lg shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-secondary border-b border-text-muted/20">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  aria-label="Close terminal"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="ml-4 text-text-secondary text-sm font-mono">
                levente@ludanyi.me: ~
              </span>
            </div>

            {/* Terminal content */}
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm"
            >
              {history.map((entry, index) => (
                <div key={index} className="mb-4">
                  {entry.command && (
                    <div className="flex items-center gap-2 text-text-primary">
                      <span className="text-accent">❯</span>
                      <span>{entry.command}</span>
                    </div>
                  )}
                  {entry.output && (
                    <div className="mt-1 text-text-secondary whitespace-pre-wrap">
                      {renderOutput(entry)}
                    </div>
                  )}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-accent">❯</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none outline-none text-text-primary font-mono"
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                  {/* Tab completion hint */}
                  {suggestion && (
                    <span className="absolute left-0 top-0 text-text-muted pointer-events-none">
                      {input}
                      <span className="opacity-50">
                        {suggestion.slice(input.length)}
                      </span>
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 bg-bg-secondary border-t border-text-muted/20 text-text-muted text-xs font-mono">
              Press <kbd className="px-1 py-0.5 bg-bg-primary rounded">Esc</kbd> to close •
              <kbd className="px-1 py-0.5 bg-bg-primary rounded ml-2">Tab</kbd> to autocomplete •
              <kbd className="px-1 py-0.5 bg-bg-primary rounded ml-2">↑↓</kbd> for history
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
