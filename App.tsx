import React, { useState, useCallback } from 'react';
import { Character } from './types';
import { generateCharacter, cartoonifyCharacter, generateBackstory } from './services/geminiService';
import Button from './components/Button';
import CharacterCard from './components/CharacterCard';
import { SparklesIcon, ExclamationTriangleIcon, PaintBrushIcon, BookOpenIcon } from './components/Icons';

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartoonifying, setIsCartoonifying] = useState<boolean>(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCharacter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCharacter(null);
    try {
      const newCharacter = await generateCharacter();
      setCharacter(newCharacter);
    } catch (err) {
      setError('Failed to generate a character. The AI may be sleeping on the job. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCartoonify = useCallback(async () => {
    if (!character) return;
    setIsCartoonifying(true);
    setError(null);
    try {
      const updatedCharacter = await cartoonifyCharacter(character);
      setCharacter(updatedCharacter);
    } catch (err) {
      setError('Failed to apply cartoon effect. The AI might be out of ink. Please try again.');
      console.error(err);
    } finally {
      setIsCartoonifying(false);
    }
  }, [character]);

  const handleGenerateBackstory = useCallback(async () => {
    if (!character) return;
    setIsGeneratingBackstory(true);
    setError(null);
    try {
      const updatedCharacter = await generateBackstory(character);
      setCharacter(updatedCharacter);
    } catch (err)      {
      setError('Failed to write backstory. The AI might have writer\'s block. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingBackstory(false);
    }
  }, [character]);

  const isAnyActionInProgress = isLoading || isCartoonifying || isGeneratingBackstory;

  return (
    <div 
      className="min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/worn-dots.png')" }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-400 font-cinzel">
            Fantasy Character Forge
          </h1>
          <p className="mt-4 text-lg text-amber-200/80">
            Summon a hero from the digital ether, complete with their own legend.
          </p>
        </header>

        <main className="flex flex-col items-center w-full">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button onClick={handleGenerateCharacter} disabled={isAnyActionInProgress}>
              {isLoading ? 'Summoning...' : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Character
                </>
              )}
            </Button>
            <Button onClick={handleCartoonify} disabled={isAnyActionInProgress || !character}>
              {isCartoonifying ? 'Animating...' : (
                <>
                  <PaintBrushIcon className="w-5 h-5 mr-2" />
                  Cartoon
                </>
              )}
            </Button>
             <Button onClick={handleGenerateBackstory} disabled={isAnyActionInProgress || !character}>
              {isGeneratingBackstory ? 'Writing...' : (
                <>
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  Backstory
                </>
              )}
            </Button>
          </div>

          <div className="w-full max-w-md min-h-[28rem] flex items-center justify-center">
            {isAnyActionInProgress && (
              <div className="flex flex-col items-center text-amber-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
                <p className="mt-4 text-lg">
                  {isLoading ? 'Forging a new legend...' : isCartoonifying ? 'Applying cartoon magic...' : 'Writing an epic tale...'}
                </p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-6 py-4 rounded-lg flex items-center max-w-md">
                <ExclamationTriangleIcon className="w-8 h-8 mr-4 text-red-500"/>
                <p>{error}</p>
              </div>
            )}

            {character && !isAnyActionInProgress && (
               <CharacterCard character={character} />
            )}

            {!character && !isAnyActionInProgress && !error && (
              <div className="text-center text-amber-300/70 p-8 border-2 border-dashed border-amber-800/50 rounded-xl">
                 <p className="text-xl">Your hero awaits their creation.</p>
              </div>
            )}
          </div>
        </main>
      </div>
       <footer className="mt-auto pt-8 text-center text-gray-500 text-sm">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;