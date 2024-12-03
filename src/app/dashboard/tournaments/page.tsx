'use client'; // Add this directive at the top


import React, { useState } from 'react';
import { Button, Typography, Box, Modal, Stack, Grid, Divider, Avatar } from '@mui/material';
import MainCard from '@/components/dashboard/tournaments/tournament-card';
import ComponentSkeleton from '@/components/dashboard/tournaments/component-skeleton';
import ViewBracketModal from '@/components/dashboard/tournaments/view-bracket-modal';
import TournamentFormModal from '@/components/dashboard/tournaments/tournament-form-modal';
import GenerateBracketModal from '@/components/dashboard/tournaments/generate-bracket-modal';
import EventFormModal from '@/components/dashboard/tournaments/event-form-modal';

// Types
interface Player {
  playerId: number;
  name: string;
  teamId: number | null;
  city: string;
  level: string;
  status: 'paid' | 'unpaid';
}

interface Event {
    gender: string;
    format: string;
    ageCap: string;
    levelLimit: string;
    description: string;
  }

interface Tournament {
    name: string;
    description: string;
    location: string;
    date: string;
    events?: Event[];
    registrationEndDate?: string;
  }

interface BracketOptions {
  bracketType: string;
}

// Custom Modal Styles
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '700px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const playerModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

// Mock players data for singles and doubles events
const singlesPlayers: Player[] = [
  { playerId: 1, name: 'John Doe', teamId: 1, city: 'Dallas', level: '4.0', status: 'paid' },
  { playerId: 2, name: 'Jane Smith', teamId: 2, city: 'Houston', level: '3.5', status: 'unpaid' },
  { playerId: 3, name: 'Bob Brown', teamId: 3, city: 'Austin', level: '3.0', status: 'paid' },
  { playerId: 4, name: 'Alice White', teamId: 4, city: 'Dallas', level: '4.0', status: 'paid' },
  { playerId: 5, name: 'Charlie Blue', teamId: 5, city: 'Houston', level: '3.5', status: 'unpaid' },
];

const doublesPlayers: Player[] = [
  { playerId: 1, name: 'John Doe', teamId: 1, city: 'Dallas', level: '4.0', status: 'paid' },
  { playerId: 2, name: 'Jane Smith', teamId: 1, city: 'Dallas', level: '4.0', status: 'unpaid' },
  { playerId: 3, name: 'Alice White', teamId: 2, city: 'Austin', level: '3.5', status: 'paid' },
  { playerId: 4, name: 'Bob Brown', teamId: 2, city: 'Austin', level: '3.5', status: 'unpaid' },
  { playerId: 5, name: 'Charlie Blue', teamId: 3, city: 'Houston', level: '3.0', status: 'paid' },
  { playerId: 6, name: 'Eve Green', teamId: 3, city: 'Houston', level: '3.0', status: 'unpaid' },
];

// Function to render players grouped by team
const renderPlayers = (players: Player[], editingEvent: Event | null) => {
  const teams: Record<number, Player[]> = {};

  players.forEach((player) => {
    if (!teams[player.teamId!]) {
      teams[player.teamId!] = [];
    }
    teams[player.teamId!].push(player);
  });

  return Object.values(teams).map((team, index) => (
    <Box key={index} sx={{ border: '2px solid black', p: 2, mb: 2, borderRadius: 2 }}>
      {team.map((player, i) => (
        <Box key={i} sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            {getPlayerStatusCircle(player.status)}
            {player.name} - {player.city} ({player.level})
          </Typography>
        </Box>
      ))}
      {/* Handle single player without a partner in doubles */}
      {team.length === 1 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
            {getPlayerStatusCircle('unpaid')} Waiting for a partner...
          </Typography>
        </Box>
      )}
    </Box>
  ));
};

// Function to render payment status circle
const getPlayerStatusCircle = (status: 'paid' | 'unpaid') => (
  <Avatar
    sx={{
      bgcolor: status === 'paid' ? 'green' : 'red',
      width: 12,
      height: 12,
      display: 'inline-block',
      mr: 1,
    }}
    title={status === 'paid' ? 'Paid' : 'Unpaid'}
  />
);

const Page: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isTournamentModalOpen, setTournamentModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTournamentIndex, setSelectedTournamentIndex] = useState<number | null>(null);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isPlayerModalOpen, setPlayerModalOpen] = useState(false);
  const [isBracketModalOpen, setBracketModalOpen] = useState(false);
  const [isViewBracketModalOpen, setViewBracketModalOpen] = useState(false);
  const [bracketData, setBracketData] = useState<any[]>([]);
  const [bracketType, setBracketType] = useState<string>('');
  const [mockPlayers, setMockPlayers] = useState<Player[]>([]);

const handleTournamentSubmit = (tournament: Tournament) => {
  if (selectedTournamentIndex !== null) {
    // Update existing tournament
    const updatedTournaments = [...tournaments];
    updatedTournaments[selectedTournamentIndex] = tournament;
    setTournaments(updatedTournaments);
  } else {
    // Create a new tournament
    setTournaments([...tournaments, { ...tournament, events: [] }]);
  }
  setTournamentModalOpen(false);
};

  const openEditModal = (index: number) => {
    setSelectedTournamentIndex(index);
    setEditingTournament(tournaments[index]);
    setEditModalOpen(true);
  };
  
  const handleEventSubmit = (event: Event) => {
    if (selectedTournamentIndex === null) return;
  
    const updatedTournaments = [...tournaments];
  
    // Ensure the events array is initialized
    if (!updatedTournaments[selectedTournamentIndex]?.events) {
      updatedTournaments[selectedTournamentIndex].events = [];
    }
  
    updatedTournaments[selectedTournamentIndex].events.push(event);
    setTournaments(updatedTournaments);
    setEventModalOpen(false);
  };
  
  
  const openEditEventModal = (eventIndex: number) => {
    if (selectedTournamentIndex === null) return;
  
    const selectedTournament = tournaments[selectedTournamentIndex];
    if (!selectedTournament?.events?.[eventIndex]) return;
  
    const selectedEvent = selectedTournament.events[eventIndex];
    setEditingEvent(selectedEvent);
    setEventModalOpen(true);
  };
  
  const handleEditEventSubmit = (updatedEvent: Event) => {
    if (selectedTournamentIndex === null || !editingTournament) return;
  
    const updatedTournaments = [...tournaments];
    const selectedTournament = updatedTournaments[selectedTournamentIndex];
  
    if (!selectedTournament?.events) return;
  
    const eventIndex = selectedTournament.events.findIndex((event) => event === editingEvent);
    if (eventIndex !== -1) {
      selectedTournament.events[eventIndex] = updatedEvent;
      setTournaments(updatedTournaments);
      setEventModalOpen(false);
    }
  };
  
  const handleDeleteEvent = (eventIndex: number) => {
    if (selectedTournamentIndex === null) return;
  
    const updatedTournaments = [...tournaments];
    const selectedTournament = updatedTournaments[selectedTournamentIndex];
  
    if (!selectedTournament?.events) return;
  
    selectedTournament.events = selectedTournament.events.filter((_, index) => index !== eventIndex);
    setTournaments(updatedTournaments);
  };
  
  
  const handleDeleteTournament = (index: number) => {
    const updatedTournaments = tournaments.filter((_, i) => i !== index);
    setTournaments(updatedTournaments);
  };
  
  const openPlayerModal = (event: Event) => {
    const players = event.format === 'singles' ? singlesPlayers : doublesPlayers;
    setMockPlayers(players);
    setPlayerModalOpen(true);
  };
  
  const handleClosePlayerModal = () => {
    setPlayerModalOpen(false);
  };
  
  const generateMockMatches = (
    players: Player[],
    bracketType: string,
    eventFormat: string
  ) => {
    const matches: any[] = [];
    let teams: Player[][] = [];
  
    if (eventFormat === 'doubles') {
      const teamMap: Record<number, Player[]> = {};
      players.forEach((player) => {
        if (!teamMap[player.teamId!]) {
          teamMap[player.teamId!] = [];
        }
        teamMap[player.teamId!].push(player);
      });
  
      teams = Object.values(teamMap).filter((team) => team.length === 2);
  
      if (Object.values(teamMap).some((team) => team.length < 2)) {
        teams.push([{ name: 'Bye', teamId: null, playerId: 0, city: '', level: '', status: 'unpaid' }]);
      }
    } else {
      teams = players.map((player) => [player]);
    }
  
    if (teams.length % 2 !== 0) {
      teams.push([{ name: 'Bye', teamId: null, playerId: 0, city: '', level: '', status: 'unpaid' }]);
    }
  
    if (bracketType === 'roundRobin') {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push({
            player1: teams[i].map((p) => p.name).join(' & '),
            player2: teams[j].map((p) => p.name).join(' & '),
            status: 'pending',
            scores: undefined,
            winning_team: undefined,
          });
        }
      }
    } else {
      for (let i = 0; i < teams.length; i += 2) {
        if (i + 1 < teams.length) {
          matches.push({
            player1: teams[i].map((p) => p.name).join(' & '),
            player2: teams[i + 1].map((p) => p.name).join(' & '),
            status: 'pending',
            scores: undefined,
            winning_team: undefined,
          });
        }
      }
    }
  
    return matches;
  };
  
  const handleGenerateBracket = (eventIndex: number) => {
    if (selectedTournamentIndex === null) return;
  
    const selectedTournament = tournaments[selectedTournamentIndex];
    if (!selectedTournament?.events?.[eventIndex]) return;
  
    const selectedEvent = selectedTournament.events[eventIndex];
    setEditingEvent(selectedEvent);
    setBracketModalOpen(true);
  };
  
  const handleBracketSubmit = (bracketOptions: { bracketType: string }) => {
    const players = editingEvent?.format === 'singles' ? singlesPlayers : doublesPlayers;
    const matches = generateMockMatches(players, bracketOptions.bracketType, editingEvent?.format || '');
    setBracketType(bracketOptions.bracketType);
    setBracketData(matches);
    setBracketModalOpen(false);
    setViewBracketModalOpen(true);
  };
  
  const handleViewBracket = () => {
    setViewBracketModalOpen(true);
  };
  
  const handleDeleteBracket = () => {
    setBracketData([]);
    setViewBracketModalOpen(false);
  };
  
  return (
    <ComponentSkeleton>
      <Grid container spacing={3}>
      <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            sx={{ position: 'absolute', top: '75px', right: '20px' }}
            onClick={() => setTournamentModalOpen(true)}
          >
            Create Tournament
          </Button>

          {/* Create Tournament Modal */}
          <Modal open={isTournamentModalOpen} onClose={() => setTournamentModalOpen(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxHeight: '90vh',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              <TournamentFormModal
                initialData={null}
                onSubmit={handleTournamentSubmit}
                onClose={() => setTournamentModalOpen(false)}
              />
            </Box>
          </Modal>

          {/* Edit Tournament Modal */}
          <Modal open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxHeight: '90vh',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {editingTournament && (
                <>
                  {/* Tournament Form */}
                  <Box
                    sx={{
                      overflowY: 'auto',
                      flexGrow: 1,
                    }}
                  >
                    <TournamentFormModal
                      initialData={editingTournament}
                      onSubmit={handleTournamentSubmit}
                      onClose={() => setEditModalOpen(false)}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => setEventModalOpen(true)}
                  >
                    + Add Event
                  </Button>

                  {/* List of Events */}
                  <Box
                    sx={{
                      overflowY: 'auto',
                      maxHeight: '30vh',
                      mt: 2,
                    }}
                  >
                    <Stack spacing={2}>
                      {editingTournament.events && editingTournament.events.map((event, eventIndex) => (
                        <Box
                          key={eventIndex}
                          sx={{
                            border: '1px solid #ccc',
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 1,
                            bgcolor: 'background.paper',
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {event.description}
                          </Typography>

                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>{event.gender + ' ' + event.format}</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>{event.levelLimit + ' and below'}</strong>
                          </Typography>

                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              sx={{ mr: 1 }}
                              onClick={() => openEditEventModal(eventIndex)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleDeleteEvent(eventIndex)}
                              sx={{ mr: 1 }}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="outlined"
                              color="info"
                              onClick={() => openPlayerModal(event)}  // Show Players button
                              sx={{ mr: 1 }}
                            >
                              Show Players
                            </Button>
                            {bracketData.length === 0 ? (
                              <Button
                                variant="outlined"
                                color="success"
                                onClick={() => handleGenerateBracket(eventIndex)}
                              >
                                Generate Bracket
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="info"
                                onClick={handleViewBracket}
                              >
                                View Bracket
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </>
              )}
            </Box>
          </Modal>

          {/* View Bracket Modal */}
          <Modal open={isViewBracketModalOpen} onClose={() => setViewBracketModalOpen(false)}>
              <ViewBracketModal
                isOpen={isViewBracketModalOpen}
                onClose={() => setViewBracketModalOpen(false)}
                bracketData={bracketData}
                bracketType={bracketType}
                onDelete={handleDeleteBracket}
              />
          </Modal>

          {/* Generate Bracket Modal */}
          <Modal open={isBracketModalOpen} onClose={() => setBracketModalOpen(false)}>
              <GenerateBracketModal
                isOpen={isBracketModalOpen}
                onClose={() => setBracketModalOpen(false)}
                onSubmit={handleBracketSubmit}
              />
          </Modal>

          {/* Players Modal */}
          <Modal open={isPlayerModalOpen} onClose={handleClosePlayerModal}>
            <Box sx={playerModalStyle}>
              <Typography variant="h5" gutterBottom>
                Players List
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {renderPlayers(mockPlayers, editingEvent)}
              <Button variant="outlined" onClick={handleClosePlayerModal} fullWidth>
                Close
              </Button>
            </Box>
          </Modal>

          {/* Event Form Modal */}
          <Modal open={isEventModalOpen} onClose={() => setEventModalOpen(false)}>
            <Box sx={modalStyle}>
              <EventFormModal
                initialData={editingEvent}
                onSubmit={editingEvent ? handleEditEventSubmit : handleEventSubmit}
                onClose={() => {
                  setEventModalOpen(false);
                  setEditingEvent(null);
                }}
              />
            </Box>
          </Modal>

          {/* Tournament List with Edit and Delete buttons */}
          <Stack spacing={3}>
            {tournaments.map((tournament, index) => (
              <MainCard key={index} title={tournament.name}>
                <Typography variant="body1">{tournament.description}</Typography>
                <Typography variant="body2">{`Location: ${tournament.location}`}</Typography>
                <Typography variant="body2">{`Date: ${tournament.date}`}</Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => openEditModal(index)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={() => handleDeleteTournament(index)}
                >
                  Delete
                </Button>
              </MainCard>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </ComponentSkeleton>
  );
};

export default Page;
