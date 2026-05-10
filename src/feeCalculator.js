const VALUE_TIERS = [
  { upTo: 500, fee: 60 },
  { upTo: 1000, fee: 120 },
  { upTo: 2000, fee: 180 },
  { upTo: 5000, fee: 240 },
  { upTo: 10000, fee: 360 },
  { upTo: 30000, fee: 480 },
  { upTo: 50000, fee: 720 },
  { upTo: 100000, fee: 960 },
  { upTo: 500000, fee: 1440 },
  { upTo: Infinity, fee: 2400 }
];

const TYPE_MULTIPLIERS = {
  parnicni: 1.0,
  krivicni: 1.25,
  prekrsajni: 0.6,
  vanparnicni: 0.5,
  upravni: 1.0,
  konsultacija: 0.25
};

const TYPE_LABELS = {
  parnicni: 'parničnom',
  krivicni: 'krivičnom',
  prekrsajni: 'prekršajnom',
  vanparnicni: 'vanparničnom',
  upravni: 'upravnom',
  konsultacija: 'konsultaciji'
};

const VAT_RATE = 0.17;
const TYPES_WITHOUT_VALUE = ['krivicni', 'prekrsajni', 'konsultacija'];

export function baseFeeForValue(value) {
  const v = Number(value);
  if (!Number.isFinite(v) || v < 0) return VALUE_TIERS[0].fee;
  for (const tier of VALUE_TIERS) {
    if (v <= tier.upTo) return tier.fee;
  }
  return VALUE_TIERS[VALUE_TIERS.length - 1].fee;
}

export function requiresValue(type) {
  return !TYPES_WITHOUT_VALUE.includes(type);
}

export function calculateFee({ type, value, actions }) {
  const multiplier = TYPE_MULTIPLIERS[type];
  if (multiplier === undefined) {
    throw new Error(`Nepoznata vrsta postupka: ${type}`);
  }

  const numActions = Math.max(1, Math.floor(Number(actions) || 1));
  const usesValue = requiresValue(type);
  const base = usesValue ? baseFeeForValue(value) : 100;
  const perActionFee = Math.round(base * multiplier);
  const subtotal = perActionFee * numActions;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  return {
    perAction: perActionFee,
    actions: numActions,
    subtotal,
    vat,
    total,
    typeLabel: TYPE_LABELS[type],
    usesValue
  };
}

export function formatBAM(amount) {
  return new Intl.NumberFormat('bs-BA', {
    style: 'currency',
    currency: 'BAM',
    maximumFractionDigits: 0
  }).format(amount);
}
