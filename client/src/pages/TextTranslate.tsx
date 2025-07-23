import { useState } from 'react';
import Layout from '@/components/Layout';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TextTranslate() {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceLang, setSourceLang] = useState('auto');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    setTranslated('');
    try {
      const res = await fetch('/api/translate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, targetLang, sourceLang: sourceLang === 'auto' ? undefined : sourceLang }),
      });
      const data = await res.json();
      if (res.ok) {
        setTranslated(data.translated);
      } else {
        setError(data.error || 'Translation failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Text Translation</h1>
        <div className="space-y-4">
          <textarea
            className="w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
              <label className="block mb-1 font-semibold">Source Language (optional)</label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="mr-2">{lang.flag}</span>{lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Target Language</label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target language..." />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="mr-2">{lang.flag}</span>{lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
           
          </div>
          <Button className="w-full mt-2" onClick={handleTranslate} disabled={loading || !inputText || !targetLang}>
            {loading ? 'Translating...' : 'Translate'}
          </Button>
        </div>
        {error && <div className="text-red-600 text-center mt-4">{error}</div>}
        {translated && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h2 className="font-semibold mb-2">Translated Text:</h2>
            <div className="whitespace-pre-line text-lg">{translated}</div>
          </div>
        )}
      </div>
    </Layout>
  );
} 