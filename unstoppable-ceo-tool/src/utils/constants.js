// The 9 Framework Categories (matching the circular diagram)
export const FRAMEWORK_CATEGORIES = [
  {
    id: 'offer-trifecta',
    name: 'Offer Trifecta',
    description: 'Your strategic offer ecosystem',
    position: 0
  },
  {
    id: 'promise',
    name: 'Promise',
    description: 'Your core transformation promise',
    position: 1
  },
  {
    id: 'story-selling',
    name: 'Story Selling',
    description: 'Your narrative sales approach',
    position: 2
  },
  {
    id: 'fame-freedom-stages',
    name: 'Fame Freedom Stages',
    description: 'Your client journey stages',
    position: 3
  },
  {
    id: 'cta',
    name: 'CTA',
    description: 'Your calls to action',
    position: 4
  },
  {
    id: 'fame-freedom-pitches',
    name: 'Fame Freedom Pitches',
    description: 'Your pitch presentations',
    position: 5
  },
  {
    id: 'fame-freedom-follow-up',
    name: 'Fame Freedom Follow Up',
    description: 'Your follow-up systems',
    position: 6
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    description: 'Your sales pipeline',
    position: 7
  },
  {
    id: 'called-to-client',
    name: 'Called to Client',
    description: 'Your ideal client profile',
    position: 8
  },
];

// Diagram configuration - all positions relative to center (cx, cy)
// Outer ring segments (9 categories)
export const DIAGRAM_OUTER_SEGMENTS = [
  { id: 'offer-trifecta', name: 'OFFER TRIFECTA', startAngle: -20, endAngle: 20 },
  { id: 'promise', name: 'PROMISE', startAngle: 20, endAngle: 60 },
  { id: 'story-selling', name: 'STORY SELLING', startAngle: 60, endAngle: 100 },
  { id: 'fame-freedom-stages', name: 'FAME FREEDOM STAGES', startAngle: 100, endAngle: 140 },
  { id: 'cta', name: 'CTA', startAngle: 140, endAngle: 180 },
  { id: 'fame-freedom-pitches', name: 'FAME FREEDOM PITCHES', startAngle: 180, endAngle: 220 },
  { id: 'fame-freedom-follow-up', name: 'FAME FREEDOM FOLLOW UP', startAngle: 220, endAngle: 260 },
  { id: 'pipeline', name: 'PIPELINE', startAngle: 260, endAngle: 300 },
  { id: 'called-to-client', name: 'CALLED TO CLIENT', startAngle: 300, endAngle: 340 },
];

// Venn circle labels (3 main circles) - offsets from their circle centers
export const DIAGRAM_VENN_LABELS = {
  unstoppableOffer: { name: 'UNSTOPPABLE OFFER', offsetX: 0, offsetY: -65, fontSize: 10 },
  unstoppableCustomerFlow: { name: 'UNSTOPPABLE\nCUSTOMER FLOW', offsetX: -50, offsetY: 20, fontSize: 7, multiline: true },
  unstoppableSales: { name: 'UNSTOPPABLE\nSALES', offsetX: 50, offsetY: 20, fontSize: 8, multiline: true },
};

// Intersection labels - offsets from diagram center (cx, cy)
export const DIAGRAM_INTERSECTION_LABELS = {
  attractive: { name: 'ATTRACTIVE', offsetX: -65, offsetY: -35, fontSize: 8 },
  abundant: { name: 'ABUNDANT', offsetX: 65, offsetY: -35, fontSize: 8 },
  authoritative: { name: 'AUTHORITATIVE', offsetX: 0, offsetY: 65, fontSize: 8 },
  unstoppableCeo: { name: 'UNSTOPPABLE CEO', offsetX: 0, offsetY: 5, fontSize: 9, highlight: true },
};

// Side badges
export const DIAGRAM_BADGES = [
  { name: 'marketable', position: 'left' },
  { name: 'reliable', position: 'right' },
  { name: 'successful', position: 'bottom' },
];

// Score color mapping - returns hex colors for SVG
export const getScoreColor = (score) => {
  if (!score || score === 0) return null;
  if (score >= 1 && score <= 3) return '#fecaca'; // Light red (red-200)
  if (score >= 4 && score <= 7) return '#fde68a'; // Light yellow (amber-200)
  if (score >= 8 && score <= 10) return '#bbf7d0'; // Light green (green-200)
  return null;
};

// Score color class for Tailwind
export const getScoreColorClass = (score) => {
  if (!score || score === 0) return '';
  if (score >= 1 && score <= 3) return 'score-red';
  if (score >= 4 && score <= 7) return 'score-yellow';
  if (score >= 8 && score <= 10) return 'score-green';
  return '';
};

// Score interpretation
export const getScoreInterpretation = (totalScore) => {
  if (totalScore < 50) {
    return {
      level: 'needs-work',
      title: 'Significant Structural Gaps',
      message: 'Your framework has critical areas that need immediate attention. Focus on the red zones first to build a stronger foundation for sustainable growth.'
    };
  }
  if (totalScore <= 75) {
    return {
      level: 'moderate',
      title: 'Strong Foundation, Inconsistent Scaling',
      message: 'You have solid elements in place but inconsistencies are limiting your growth. Address the yellow zones to unlock your next level of success.'
    };
  }
  return {
    level: 'strong',
    title: 'High-Level Performance',
    message: 'Your framework is well-optimized. Fine-tune the remaining areas to maximize your scaling opportunity and dominate your market.'
  };
};

// Format currency
export const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format number with commas
export const formatNumber = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};
