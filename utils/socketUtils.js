export const getRoomName = (debateId) => `debate_${debateId}`;

export class DebateTimers {
  constructor() {
    this.timers = new Map();
  }
  has(debateId) {
    return this.timers.has(String(debateId));
  }
  set(debateId, timeoutId) {
    this.timers.set(String(debateId), timeoutId);
  }
  clear(debateId) {
    const key = String(debateId);
    const t = this.timers.get(key);
    if (t) clearTimeout(t);
    this.timers.delete(key);
  }
}
