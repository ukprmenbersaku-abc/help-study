
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

const StudySearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<'google' | 'duckduckgo'>('google');
  const [searchUrl, setSearchUrl] = useState(''); // Empty initially to show home
  const [isInactive, setIsInactive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<number | null>(null);

  const resetTimer = () => {
    setIsInactive(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsInactive(true);
    }, 5000);
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleSearch = (e?: React.FormEvent, selectedEngine?: 'google' | 'duckduckgo') => {
    if (e) e.preventDefault();
    const targetEngine = selectedEngine || engine;
    if (!query.trim()) {
      setSearchUrl(targetEngine === 'google' ? 'https://www.google.com/search?igu=1' : 'https://duckduckgo.com/html/');
    } else {
      if (targetEngine === 'google') {
        setSearchUrl(`https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`);
      } else {
        setSearchUrl(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
      }
    }
    setEngine(targetEngine);
    resetTimer();
  };

  const toggleEngine = () => {
    const newEngine = engine === 'google' ? 'duckduckgo' : 'google';
    setEngine(newEngine);
    if (searchUrl) {
      handleSearch(undefined, newEngine);
    }
  };

  const openInNewTab = () => {
    if (searchUrl) {
      window.open(searchUrl, '_blank');
    }
  };

  const goHome = () => {
    setSearchUrl('');
    setQuery('');
  };

  if (!searchUrl) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-50 p-6 animate-fade-in">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex p-4 bg-indigo-600 text-white rounded-[2rem] mb-2">
              <Icon name="search" className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">学習検索ホーム</h1>
            <p className="text-slate-500 text-lg font-medium">
              調べたいことを入力して、最適なエンジンで検索しましょう。
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <form onSubmit={(e) => handleSearch(e)} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Icon name="search" className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="キーワードを入力..."
                className="w-full pl-14 pr-4 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-xl"
              />
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleSearch(undefined, 'google')}
                className="flex flex-col items-center p-6 bg-indigo-600 text-white rounded-3xl hover:bg-indigo-700 transition-all group active:scale-95"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-black">Google 検索</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase">おすすめ</span>
                </div>
                <p className="text-xs opacity-80 font-medium">最も正確で豊富な検索結果を表示します</p>
              </button>

              <button
                onClick={() => handleSearch(undefined, 'duckduckgo')}
                className="flex flex-col items-center p-6 bg-white border-2 border-slate-100 text-slate-600 rounded-3xl hover:border-slate-300 transition-all active:scale-95"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-black">DuckDuckGo</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">表示が安定しないため、現在はおすすめしません</p>
                <span className="mt-2 text-[10px] text-rose-400 font-bold">※非推奨</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 text-slate-400 font-bold text-sm">
            <div className="flex items-center gap-2">
              <Icon name="check" className="w-4 h-4 text-green-500" />
              <span>フルスクリーン表示</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="check" className="w-4 h-4 text-green-500" />
              <span>広告なしの学習環境</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in bg-white" onMouseMove={resetTimer} onKeyDown={resetTimer}>
      <div className="px-4 py-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={goHome}
            className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            title="ホームに戻る"
          >
            <Icon name="chevronLeft" className="w-4 h-4" />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-bold text-slate-900 leading-none">学習検索</h2>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${engine === 'google' ? 'Google' : 'DuckDuckGo'}で検索...`}
            className="w-full pl-9 pr-20 py-1.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium text-sm"
          />
          <button
            type="submit"
            className="absolute right-1 inset-y-1 px-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-600 transition-all active:scale-95"
          >
            検索
          </button>
        </form>

        <div className="flex items-center gap-2 shrink-0">
           <button 
             onClick={toggleEngine}
             className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-black transition-all ${
               engine === 'google' 
               ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
               : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
             }`}
             title={engine === 'google' ? 'DuckDuckGoに切り替え' : 'Googleに切り替え'}
           >
             <Icon name="history" className="w-3 h-3" />
             <span>{engine === 'google' ? 'DDGに切替' : 'Googleに切替'}</span>
           </button>
           
           <button 
             onClick={openInNewTab}
             className={`flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 border border-indigo-700 rounded-xl text-white text-[10px] font-black hover:bg-indigo-700 transition-all ${isInactive ? 'animate-pulse-custom' : ''}`}
             title="新しいタブで開く"
           >
             <Icon name="arrow-right" className="w-3 h-3" />
             <span className="hidden sm:inline">外部で開く</span>
           </button>
        </div>
      </div>

      <div className="flex-1 relative group overflow-hidden">
        <div className="w-full h-full flex flex-col">
          {engine === 'google' && (
            <div className="bg-amber-50/80 px-4 py-0.5 border-b border-amber-100 flex items-center justify-center gap-2 text-[9px] font-bold text-amber-700/80">
              <span>Google (?igu=1) 使用中。将来的に制限される可能性があります。</span>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={searchUrl}
            className="w-full flex-1 border-none"
            title="Study Search"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  );
};

export default StudySearchView;
