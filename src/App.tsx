import { BookOpen, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { Flashcard as FlashcardComponent } from './components/Flashcard';
import { FlashcardForm } from './components/FlashcardForm';
import { supabase } from './lib/supabase';
import { ThemeToggle } from './lib/theme';
import { Flashcard } from './types/database';

function App() {
  const [session, setSession] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
      if (session) fetchFlashcards();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      if (session) fetchFlashcards();
      else setFlashcards([]);
    });
  }, []);

  const fetchFlashcards = async () => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlashcards(data || []);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <AuthForm onAuthSuccess={() => setSession(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Vocab Flashcards
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FlashcardForm onCardAdded={fetchFlashcards} />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <p className="text-center col-span-2 dark:text-gray-300">
                  Loading flashcards...
                </p>
              ) : flashcards.length === 0 ? (
                <p className="text-center col-span-2 text-gray-500 dark:text-gray-400">
                  No flashcards yet. Add your first one!
                </p>
              ) : (
                flashcards.map((card) => (
                  <FlashcardComponent
                    key={card.id}
                    card={card}
                    onDelete={() => fetchFlashcards()}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
