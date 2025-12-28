export const colorScheme = {
  teamA: {
    bg: 'bg-primary-100',
    text: 'text-primary-800',
    border: 'border-primary-300',
    button: 'bg-primary-500 hover:bg-primary-600',
    badge: 'bg-primary-500',
  },
  teamB: {
    bg: 'bg-secondary-100',
    text: 'text-secondary-800',
    border: 'border-secondary-300',
    button: 'bg-secondary-500 hover:bg-secondary-600',
    badge: 'bg-secondary-500',
  },
  neutral: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    button: 'bg-gray-500 hover:bg-gray-600',
  },
  accent: {
    bg: 'bg-accent-100',
    text: 'text-accent-800',
    border: 'border-accent-300',
    button: 'bg-accent-500 hover:bg-accent-600',
    badge: 'bg-accent-500',
  },
};

export const getTeamColor = (teamName) => {
  if (teamName === 'Team A') return colorScheme.teamA;
  if (teamName === 'Team B') return colorScheme.teamB;
  return colorScheme.neutral;
};
