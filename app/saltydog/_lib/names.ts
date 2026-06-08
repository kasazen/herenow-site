import crypto from "node:crypto";

// Ported byte-for-byte from saltydog/core/names.py so the public leaderboard
// shows the same generated handle whether rendered by the bot or by this app.

const ADJECTIVES = [
  "Salty", "Bilge-Brained", "Iron-Eyed", "Crimson", "Stormbound", "Sea-Worn",
  "Two-Toothed", "Black-Sailed", "Lantern-Jawed", "Saltcrust", "Wave-Wise",
  "Tide-Bent", "Cutlass", "Powder", "Skull-Lit", "Anchor-Foot", "Coral",
  "Hook-Handed",
] as const;

const GIVEN_NAMES = [
  "Joe", "Wren", "Bart", "Mary", "Ned", "Bess", "Obadiah", "Mortimer",
  "Anne", "Edward", "Grace", "Henry", "Ching", "Calico", "Long John",
  "Black Sam", "Stede", "Israel", "Charlotte", "Olivier", "Rusty", "Patch",
  "Tobias", "Margaret",
] as const;

const EPITHETS = [
  "the Salty", "the Bilge-rat", "the Wave-cutter", "the Ship-burner",
  "the Salt-tongue", "the Plank-walker", "the Storm-rider",
  "the Anchor-thrower", "the Rum-runner", "the Cannon-eared",
  "the Mast-climber", "the Treasure-greedy", "the Sea-eyed",
  "the Cutlass-quick", "the Bone-shaker", "the Reef-runner", "the Salt-sworn",
  "the Black-flagged",
] as const;

function hashIndices(userId: number): [number, number, number] {
  const h = crypto.createHash("sha256").update(String(userId)).digest();
  return [
    h[0] % ADJECTIVES.length,
    h[1] % GIVEN_NAMES.length,
    h[2] % EPITHETS.length,
  ];
}

export function defaultDisplayName(userId: number): string {
  if (userId <= 0) return "the Stowaway";
  const [a, n, e] = hashIndices(userId);
  return `${ADJECTIVES[a]} ${GIVEN_NAMES[n]} ${EPITHETS[e]}`;
}

export function displayNameFor(userId: number, chosen: string | null): string {
  const c = (chosen || "").trim();
  return c ? c : defaultDisplayName(userId);
}

const RANK_THRESHOLDS: ReadonlyArray<readonly [string, number]> = [
  ["Captain", 2000],
  ["First Mate", 500],
  ["Deckhand", 100],
  ["Stowaway", 0],
];

export function rankFor(balance: number): string {
  for (const [name, threshold] of RANK_THRESHOLDS) {
    if (balance >= threshold) return name;
  }
  return "Stowaway";
}
