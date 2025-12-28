export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getTimeRemaining = (endTime) => {
  if (!endTime) return 0;
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = Math.max(0, Math.floor((end - now) / 1000));
  return diff;
};
