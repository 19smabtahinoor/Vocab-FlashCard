import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle, BookOpen, Hash } from 'lucide-react';

interface FlashcardFormProps {
  onCardAdded: () => void;
}

export function FlashcardForm({ onCardAdded }: FlashcardFormProps) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [sentence, setSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
    fetchTotalCards();
  }, []);

  const fetchTotalCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setTotalCards(count || 0);
    } catch (err) {
      console.error('Error fetching card count:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('flashcards').insert([
        {
          user_id: user.id,
          word: word.trim(),
          meaning: meaning.trim(),
          example_sentence: sentence.trim() || null,
        },
      ]);

      if (error) throw error;

      setWord('');
      setMeaning('');
      setSentence('');
      onCardAdded();
      fetchTotalCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">New Flashcard</h3>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <Hash className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{totalCards} Cards</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Word
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                placeholder="Enter a word..."
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meaning
              <input
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                placeholder="Enter the meaning..."
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Example Sentence
              <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Write an example sentence..."
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            'Adding...'
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              Add Flashcard
            </>
          )}
        </button>
      </form>
    </div>
  );
}