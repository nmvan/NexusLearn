import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Loader2, Terminal, FileCode2, FolderTree, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LabFile {
  name: string;
  path: string;
  starter: string;
  readonly?: boolean;
}

type LabStatus = 'idle' | 'success' | 'error' | 'timeout';

type LanguageKey = 'python' | 'javascript' | 'java';

const LANGUAGE_FILES: Record<LanguageKey, LabFile[]> = {
  python: [
    {
      name: 'main.py',
      path: 'python/main.py',
      starter: [
        'def calculate_total(prices: list[int]) -> int:',
        '    # TODO: return correct total',
        '    total = 0',
        '    for price in prices:',
        '        total += price',
        '    return total',
        '',
        'if __name__ == "__main__":',
        '    sample_input = [12, 8, 5]',
        '    print(calculate_total(sample_input))'
      ].join('\n'),
    },
    {
      name: 'tests.py',
      path: 'python/tests.py',
      starter: [
        'from main import calculate_total',
        '',
        'def test_small_numbers():',
        '    assert calculate_total([1, 2, 3]) == 6',
        '',
        'def test_empty_list():',
        '    assert calculate_total([]) == 0'
      ].join('\n'),
      readonly: true,
    },
  ],
  javascript: [
    {
      name: 'index.js',
      path: 'javascript/index.js',
      starter: [
        'export function calculateTotal(prices) {',
        '  // TODO: return the total price',
        '  return prices.reduce((sum, current) => sum + current, 0);',
        '}',
        '',
        'console.log(calculateTotal([12, 8, 5]));'
      ].join('\n'),
    },
    {
      name: 'tests.spec.js',
      path: 'javascript/tests.spec.js',
      starter: [
        "import { calculateTotal } from './index';",
        '',
        'describe("calculateTotal", () => {',
        '  it("handles empty arrays", () => {',
        '    expect(calculateTotal([])).toBe(0);',
        '  });',
        '',
        '  it("sums positive integers", () => {',
        '    expect(calculateTotal([1, 2, 3])).toBe(6);',
        '  });',
        '});'
      ].join('\n'),
      readonly: true,
    },
  ],
  java: [
    {
      name: 'Main.java',
      path: 'java/Main.java',
      starter: [
        'import java.util.List;',
        '',
        'public class Main {',
        '    public static int calculateTotal(List<Integer> prices) {',
        '        // TODO: return the correct total',
        '        int total = 0;',
        '        for (int price : prices) {',
        '            total += price;',
        '        }',
        '        return total;',
        '    }',
        '',
        '    public static void main(String[] args) {',
        '        System.out.println(calculateTotal(List.of(12, 8, 5)));',
        '    }',
        '}'
      ].join('\n'),
    },
    {
      name: 'MainTest.java',
      path: 'java/MainTest.java',
      starter: [
        'import static org.junit.jupiter.api.Assertions.assertEquals;',
        'import org.junit.jupiter.api.Test;',
        'import java.util.List;',
        '',
        'class MainTest {',
        '    @Test',
        '    void handlesEmptyList() {',
        '        assertEquals(0, Main.calculateTotal(List.of()));',
        '    }',
        '',
        '    @Test',
        '    void sumsPositiveNumbers() {',
        '        assertEquals(6, Main.calculateTotal(List.of(1, 2, 3)));',
        '    }',
        '}'
      ].join('\n'),
      readonly: true,
    },
  ],
};

const LANGUAGE_OUTPUT: Record<LanguageKey, string> = {
  python: ['✅ Output', '25', '', '✅ Sample test comparison: PASS'].join('\n'),
  javascript: ['✅ Output', '25', '', '✅ Sample test comparison: PASS'].join('\n'),
  java: ['✅ Output', '25', '', '✅ Sample test comparison: PASS'].join('\n'),
};

const STATUS_META: Record<LabStatus, { label: string; tone: string }> = {
  idle: { label: 'Idle', tone: 'text-slate-400' },
  success: { label: 'All tests passed', tone: 'text-emerald-400' },
  error: { label: 'Syntax Error', tone: 'text-amber-400' },
  timeout: { label: 'Time Limit Exceeded', tone: 'text-rose-400' },
};

const LANGUAGE_OPTIONS: { id: LanguageKey; label: string }[] = [
  { id: 'python', label: 'Python 3.11' },
  { id: 'javascript', label: 'Node.js 20' },
  { id: 'java', label: 'Java 17' },
];

export function LabWorkspace() {
  const [language, setLanguage] = useState<LanguageKey>('python');
  const [selectedPath, setSelectedPath] = useState<string>(LANGUAGE_FILES.python[0].path);
  const [codeState, setCodeState] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.values(LANGUAGE_FILES).forEach(group => {
      group.forEach(file => {
        initial[file.path] = file.starter;
      });
    });
    return initial;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<LabStatus>('idle');
  const [output, setOutput] = useState('Output will appear here once you run the code.');
  const [editorWidth, setEditorWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const splitRef = useRef<HTMLDivElement | null>(null);

  const files = LANGUAGE_FILES[language];
  const activeFile = useMemo(() => {
    const found = files.find(file => file.path === selectedPath);
    return found ?? files[0];
  }, [files, selectedPath]);

  const activeCode = codeState[activeFile.path] ?? '';

  const handleLanguageChange = (next: LanguageKey) => {
    setLanguage(next);
    const fallbackPath = LANGUAGE_FILES[next][0]?.path;
    if (fallbackPath) {
      setSelectedPath(fallbackPath);
    }
  };

  const updateCode = (value: string) => {
    setCodeState(prev => ({ ...prev, [activeFile.path]: value }));
  };

  const resetFile = () => {
    updateCode(activeFile.starter);
    setStatus('idle');
    setOutput('Output will appear here once you run the code.');
  };

  const beginResize = useCallback(() => {
    if (!isLargeScreen) {
      return;
    }
    setIsResizing(true);
  }, [isLargeScreen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsLargeScreen(event.matches);
    };

    setIsLargeScreen(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isLargeScreen && isResizing) {
      setIsResizing(false);
    }
  }, [isLargeScreen, isResizing]);

  useEffect(() => {
    if (!isResizing || !isLargeScreen) {
      return;
    }

    // Track pointer movement to resize editor and output panes in the lab workspace.
    const handlePointerMove = (event: PointerEvent) => {
      const container = splitRef.current;
      if (!container) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      const relativeX = event.clientX - bounds.left;
      if (bounds.width <= 0) {
        return;
      }

      const minWidth = 35;
      const maxWidth = 75;
      const percentage = (relativeX / bounds.width) * 100;
      setEditorWidth(Math.min(Math.max(percentage, minWidth), maxWidth));
    };

    const stopResize = () => setIsResizing(false);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResize);
    };
  }, [isResizing, isLargeScreen]);

  const simulateRun = () => {
    if (isRunning) {
      return;
    }
    setIsRunning(true);
    setStatus('idle');
    setOutput('Booting isolated container...');

    const lowerCode = activeCode.toLowerCase();

    window.setTimeout(() => {
      if (lowerCode.includes('while true') || lowerCode.includes('for(;;)')) {
        setStatus('timeout');
        setOutput([
          '⏱️ Time Limit Exceeded',
          'Execution stopped after 5s time window.',
          'Tip: double-check for infinite loops or large inputs.'
        ].join('\n'));
      } else if (lowerCode.includes('todo')) {
        setStatus('error');
        setOutput([
          'SyntaxError: incomplete implementation near line 2',
          'Hint: replace TODO comments with working logic before submitting.'
        ].join('\n'));
      } else {
        setStatus('success');
        setOutput(LANGUAGE_OUTPUT[language]);
      }
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-lg shadow-slate-950/40">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400">UC04 · Practice Lab</p>
          <h3 className="text-lg font-semibold text-slate-100">Build a reusable total calculator</h3>
        </div>
        <div className="flex items-center gap-2">
          {LANGUAGE_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                language === option.id
                  ? 'border-indigo-400/70 bg-indigo-500/10 text-indigo-200'
                  : 'border-slate-700 text-slate-400 hover:border-indigo-400/60 hover:text-indigo-200'
              )}
              onClick={() => handleLanguageChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-48 flex-shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/40 md:flex">
          <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-3 text-xs font-semibold uppercase text-slate-400">
            <FolderTree size={14} /> Files
          </div>
          <div className="flex-1 overflow-y-auto">
            {files.map(file => {
              const isActive = file.path === activeFile.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedPath(file.path)}
                  className={cn(
                    'flex w-full flex-col gap-0.5 border-l-2 px-3 py-2 text-left transition-colors',
                    isActive
                      ? 'border-indigo-400/80 bg-indigo-500/10 text-indigo-100'
                      : 'border-transparent text-slate-400 hover:border-indigo-400/50 hover:bg-slate-900/80 hover:text-indigo-100'
                  )}
                >
                  <span className="flex items-center gap-2 text-xs font-medium">
                    <FileCode2 size={14} /> {file.name}
                  </span>
                  {file.readonly && (
                    <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">read only</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2 text-xs uppercase tracking-widest text-slate-400">
            <span>{activeFile.name}</span>
            <span>{STATUS_META[status].label}</span>
          </header>

          <div ref={splitRef} className="flex flex-1 flex-col lg:flex-row">
            <section
              className="flex flex-1 flex-col border-b border-slate-800/70 bg-slate-950/40 lg:min-w-[320px] lg:border-b-0 lg:border-r"
              style={isLargeScreen ? { flexBasis: `${editorWidth}%` } : undefined}
            >
              <textarea
                value={activeCode}
                onChange={event => updateCode(event.target.value)}
                spellCheck={false}
                readOnly={activeFile.readonly}
                className="h-full w-full flex-1 resize-none whitespace-pre font-mono text-sm leading-6 text-slate-100 bg-slate-950/80 px-4 py-4 focus:outline-none"
              />
              <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Terminal size={14} /> Container ready · &lt;5s response
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetFile}
                    className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                  >
                    <RotateCcw size={14} /> Reset File
                  </button>
                  <button
                    type="button"
                    onClick={simulateRun}
                    disabled={isRunning}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                      isRunning
                        ? 'border-indigo-400/60 bg-indigo-500/10 text-indigo-200'
                        : 'border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-500'
                    )}
                  >
                    {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                    Run Code
                  </button>
                </div>
              </div>
            </section>
            <div className="hidden w-px self-stretch bg-slate-800/70 lg:flex">
              <button
                type="button"
                onPointerDown={beginResize}
                className={`-ml-[9px] flex h-full w-[18px] cursor-col-resize select-none items-center justify-center text-slate-700 transition-colors hover:text-indigo-300 ${
                  isResizing ? 'text-indigo-300' : ''
                }`}
                aria-label="Resize code and output panels"
              >
                <span className="block h-24 w-[2px] rounded-full bg-current" />
              </button>
            </div>
            <aside
              className="flex w-full flex-col bg-slate-950/30 lg:min-w-[260px]"
              style={isLargeScreen ? { flexBasis: `${100 - editorWidth}%` } : undefined}
            >
              <div className="border-b border-slate-800/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Live Output</p>
              </div>
              <pre className={cn(
                'flex-1 whitespace-pre-wrap break-words bg-slate-950/80 px-4 py-4 text-sm leading-6',
                STATUS_META[status].tone
              )}>
                {output}
              </pre>
              <div className="border-t border-slate-800/70 px-4 py-3 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Reference solution benchmarked automatically.
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-400" />
                  Compiler errors show exact line numbers when available.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
