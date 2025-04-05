interface GameRecord {
  gameType: string;
  gameTitle: string;
  score: number;
  level: number;
  date: string;
}

// Get game history from localStorage
export const getGameHistory = (): GameRecord[] => {
  const history = localStorage.getItem('gameHistory');
  return history ? JSON.parse(history) : [];
};

// Save a new game record to history
export const saveGameRecord = (gameType: string, gameTitle: string, score: number, level: number): void => {
  const history = getGameHistory();
  const newRecord: GameRecord = {
    gameType,
    gameTitle,
    score,
    level,
    date: new Date().toISOString(),
  };
  
  // Add new record at the beginning of the array
  history.unshift(newRecord);
  
  // Keep only the latest 50 records
  const trimmedHistory = history.slice(0, 50);
  
  localStorage.setItem('gameHistory', JSON.stringify(trimmedHistory));
};

// Clear all game history
export const clearGameHistory = (): void => {
  localStorage.removeItem('gameHistory');
};
