import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';

// Define types for props and game data
interface Game {
  player1: string | string[]; // Support for Singles and Doubles
  player2: string | string[];
  scores?: string;
  gameNumber?: number;
}

interface ViewBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  bracketData: Game[];
  onDelete: () => void;
  bracketType: string;
}

// Helper function to calculate round names based on total teams
const getRoundNames = (totalTeams: number): string[] => {
  const rounds: string[] = [];
  let currentTeams = totalTeams;

  while (currentTeams > 1) {
    if (currentTeams === 2) {
      rounds.push('Finals');
    } else if (currentTeams <= 4) {
      rounds.push('Semi Finals');
    } else if (currentTeams <= 8) {
      rounds.push('Quarter Finals');
    } else if (currentTeams <= 16) {
      rounds.push('Round of 16');
    } else {
      rounds.push('Round of 32');
    }
    currentTeams = Math.ceil(currentTeams / 2);
  }

  return rounds.reverse(); // Reverse the round order for left-to-right display
};

// Helper function to simulate advancing players through rounds
const generateRounds = (
  games: Game[],
  totalTeams: number
): { rounds: Game[][]; roundNames: string[] } => {
  const rounds: Game[][] = [];
  let currentRoundGames = [...games];
  let gameCounter = 1;

  const roundNames = getRoundNames(totalTeams);

  while (currentRoundGames.length > 1) {
    rounds.push(currentRoundGames);
    const nextRoundGames: Game[] = [];

    for (let i = 0; i < currentRoundGames.length; i += 2) {
      const player1 =
        currentRoundGames[i]?.player1 || `Winner of Game ${currentRoundGames[i]?.gameNumber || gameCounter}`;
      const player2 =
        currentRoundGames[i + 1]?.player1 || `Winner of Game ${currentRoundGames[i + 1]?.gameNumber || gameCounter + 1}`;

      nextRoundGames.push({
        player1,
        player2,
        gameNumber: gameCounter,
      });

      gameCounter += 1;
    }

    currentRoundGames = nextRoundGames;
  }

  if (currentRoundGames.length === 1) {
    currentRoundGames[0].gameNumber = gameCounter;
    rounds.push(currentRoundGames);
  }

  return { rounds, roundNames };
};

// Render individual match
const renderMatch = (game: Game, index: number, eventFormat: 'Singles' | 'Doubles') => {
  return (
    <Box
      key={index}
      sx={{
        mb: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '4px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Typography>
        {eventFormat === 'Doubles'
          ? `${(game.player1 as string[]).join(' & ')} vs ${(game.player2 as string[]).join(' & ')}`
          : `${game.player1} vs ${game.player2}`}
      </Typography>
      {game.scores ? (
        <Typography variant="body2">{game.scores}</Typography>
      ) : (
        <Typography variant="body2">Pending</Typography>
      )}
    </Box>
  );
};

// Main ViewBracketModal component
const ViewBracketModal: React.FC<ViewBracketModalProps> = ({
  isOpen,
  onClose,
  bracketData,
  onDelete,
  bracketType,
}) => {
  const renderEliminationBracket = (games: Game[], totalTeams: number, eventFormat: 'Singles' | 'Doubles') => {
    const { rounds, roundNames } = generateRounds(games, totalTeams);

    return (
      <Grid container spacing={4} sx={{ mt: 2, position: 'relative' }}>
        {rounds.reverse().map((roundGames, roundIndex) => (
          <Grid item xs key={roundIndex}>
            <Typography variant="subtitle1" gutterBottom>
              {roundNames[roundIndex]}
            </Typography>
            {roundGames.map((game, index) => (
              <Box
                key={index}
                sx={{
                  mb: 4,
                  p: 2,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    bgcolor: 'white',
                    px: 1,
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  {`Game ${game.gameNumber}`}
                </Typography>

                <Typography>
                  {game.player1} vs {game.player2}
                </Typography>
                {game.scores ? (
                  <Typography variant="body2">{game.scores}</Typography>
                ) : (
                  <Typography variant="body2">Pending</Typography>
                )}
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderRoundRobinBracket = (games: Game[], eventFormat: 'Singles' | 'Doubles') => {
    return (
      <>
        <Typography variant="h6">Round Robin Matches</Typography>
        <Grid container spacing={4}>
          {games.map((game, index) => (
            <Grid item xs={6} key={index}>
              {renderMatch(game, index, eventFormat)}
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Playoff Bracket
        </Typography>
        {renderEliminationBracket(games, games.length, eventFormat)}
      </>
    );
  };

  const bracketDisplayName =
    bracketType === 'roundRobin'
      ? 'Round Robin'
      : bracketType === 'singleElimination'
      ? 'Single Elimination'
      : 'Double Elimination';

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          width: '90vw',
          height: '90vh',
          margin: 'auto',
          mt: '5vh',
          boxShadow: 24,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {bracketDisplayName}
        </Typography>

        {bracketType === 'roundRobin' && renderRoundRobinBracket(bracketData, 'Singles')}
        {bracketType === 'singleElimination' && renderEliminationBracket(bracketData, bracketData.length, 'Singles')}
        {bracketType === 'doubleElimination' && renderEliminationBracket(bracketData, bracketData.length, 'Doubles')}

        <Button variant="contained" onClick={onClose} fullWidth sx={{ mt: 2 }}>
          Close
        </Button>
        <Button variant="outlined" onClick={onDelete} fullWidth sx={{ mt: 2, color: 'red', borderColor: 'red' }}>
          Delete Bracket
        </Button>
      </Box>
    </Modal>
  );
};

export default ViewBracketModal;