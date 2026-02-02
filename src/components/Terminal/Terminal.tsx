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
      if (suggestions.length > 0 && suggestions[0].toLowerCase() !== input.toLowerCase()) {
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

  // Render output
  // Note: HTML content is safe as it comes from hardcoded command responses in commands.ts,
  // not from user input. This is intentional for formatting command output.
  const renderOutput = (entry: HistoryEntry) => {
    if (entry.isHtml) {
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
            className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Terminal window */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl h-[70vh] sm:h-[65vh] overflow-hidden flex flex-col"
            style={{
              backgroundColor: 'var(--bg-terminal)',
              border: '1px solid var(--border)',
              boxShadow: '6px 6px 0 0 var(--shadow)',
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-3 h-3 rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--accent-muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-muted)'}
                    aria-label="Close terminal"
                  />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--border-hover)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--border-hover)' }} />
                </div>
                <span
                  className="font-mono text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  terminal
                </span>
              </div>
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                levente@ludanyi.me
              </span>
            </div>

            {/* Terminal content */}
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-5 font-mono text-sm leading-relaxed cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((entry, index) => (
                <div key={index} className="mb-5">
                  {entry.command && (
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span style={{ color: 'var(--accent)' }}>→</span>
                      <span>{entry.command}</span>
                    </div>
                  )}
                  {entry.output && (
                    <div
                      className="mt-2 whitespace-pre-wrap"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {renderOutput(entry)}
                    </div>
                  )}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span style={{ color: 'var(--accent)' }}>→</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none outline-none font-mono"
                    style={{
                      color: 'var(--text-primary)',
                      caretColor: 'var(--accent)',
                    }}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                  {/* Tab completion hint */}
                  {suggestion && suggestion.toLowerCase().startsWith(input.toLowerCase()) && (
                    <span
                      className="absolute left-0 top-0 pointer-events-none"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {input}
                      <span className="opacity-40">
                        {suggestion.slice(input.length)}
                      </span>
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Footer hint */}
            <div
              className="px-5 py-3 font-mono text-xs flex items-center justify-between"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <span>
                <kbd className="px-1.5 py-0.5 mr-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>Esc</kbd>
                close
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 mr-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>Tab</kbd>
                complete
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 mr-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>↑↓</kbd>
                history
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
