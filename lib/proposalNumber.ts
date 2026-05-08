export function generateProposalNumber(sequenceIndex: number): string {
  const year = new Date().getFullYear();
  const seq = String(sequenceIndex + 1).padStart(4, '0');
  return `SCO-${year}-${seq}`;
}
