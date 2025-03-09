import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types/database';
import { RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import clsx from 'clsx';

interface FlashcardProps {
  card: FlashcardType;
  onDelete: (id: string) => void;
}

export function Flashcard({ card, onDelete }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', card.id);

      if (error) throw error;
      onDelete(card.id);
    } catch (err) {
      console.error('Error deleting flashcard:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReview = async () => {
    try {
      await supabase
        .from('flashcards')
        .update({
          review_count: card.review_count + 1,
          last_reviewed: new Date().toISOString(),
        })
        .eq('id', card.id);
    } catch (err) {
      console.error('Error updating review count:', err);
    }
  };

  return (
    <div 
      className={clsx(
        "relative h-64 w-full cursor-pointer perspective-1000",
        "transition-transform duration-300 transform-style-preserve-3d",
        { "rotate-y-180": isFlipped }
      )}
      onClick={() => {
        setIsFlipped(!isFlipped);
        if (!isFlipped) handleReview();
      }}
    >
      {/* Front */}
      <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 backface-hidden">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.word}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4" />
          <span>Reviewed {card.review_count} times</span>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Click to reveal meaning</p>
      </div>

      {/* Back */}
      <div className="absolute inset-0 bg-indigo-50 dark:bg-gray-700 rounded-lg shadow-md p-6 rotate-y-180 backface-hidden">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Meaning:</h4>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{card.meaning}</p>
        
        {card.example_sentence && (
          <>
            <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Example:</h4>
            <p className="mt-2 text-gray-700 dark:text-gray-300 italic">{card.example_sentence}</p>
          </>
        )}
      </div>
    </div>
  );
}