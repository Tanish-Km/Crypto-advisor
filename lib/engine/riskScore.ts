import { InvestorProfile, PersonaType } from '@/types';

export interface RiskInput {
  lossReaction: InvestorProfile['lossReaction'];
  riskPreference: InvestorProfile['riskPreference'];
  horizonYears: number;
  incomeStability: InvestorProfile['incomeStability'];
  experience: InvestorProfile['experience'];
  goal: InvestorProfile['goal'];
  liquidityNeed: boolean;
}

export function computeRiskScore(input: RiskInput): {
  riskScore: number;
  persona: PersonaType;
} {
  // Normalize lossReaction
  const lossReactionMap: Record<InvestorProfile['lossReaction'], number> = {
    sell_all: 0.0,
    sell_some: 0.33,
    hold: 0.67,
    buy_more: 1.0,
  };
  const normLoss = lossReactionMap[input.lossReaction] ?? 0.5;

  // Normalize riskPreference (1..4)
  const normPref = Math.max(0, Math.min(1, (input.riskPreference - 1) / 3));

  // Normalize horizonYears (<1y -> 0, 1-3y -> 0.33, 3-5y -> 0.67, 5y+ -> 1.0)
  let normHorizon = 0.5;
  if (input.horizonYears < 1) normHorizon = 0.0;
  else if (input.horizonYears <= 3) normHorizon = 0.33;
  else if (input.horizonYears <= 5) normHorizon = 0.67;
  else normHorizon = 1.0;

  // Normalize incomeStability
  const incomeMap: Record<InvestorProfile['incomeStability'], number> = {
    uncertain: 0.0,
    variable: 0.5,
    stable: 1.0,
  };
  const normIncome = incomeMap[input.incomeStability] ?? 0.5;

  // Normalize experience
  const expMap: Record<InvestorProfile['experience'], number> = {
    none: 0.0,
    beginner: 0.5,
    intermediate: 1.0,
  };
  const normExp = expMap[input.experience] ?? 0.0;

  // Normalize goal
  const goalMap: Record<InvestorProfile['goal'], number> = {
    save: 0.0,
    learn: 0.33,
    grow: 0.67,
    short_term: 1.0,
  };
  const normGoal = goalMap[input.goal] ?? 0.5;

  // Weighted sum (weights sum to 1.0)
  const rawScore =
    normLoss * 0.25 +
    normPref * 0.25 +
    normHorizon * 0.20 +
    normIncome * 0.10 +
    normExp * 0.10 +
    normGoal * 0.10;

  // Scale from [0, 1] to [1, 10]
  let scaledScore = 1 + rawScore * 9;

  // If liquidityNeed is true, subtract 1 (min 1)
  if (input.liquidityNeed) {
    scaledScore -= 1;
  }

  // Round to nearest integer between 1 and 10
  const riskScore = Math.max(1, Math.min(10, Math.round(scaledScore)));

  // Persona mapping
  let persona: PersonaType = 'balanced_builder';
  if (riskScore <= 3) {
    persona = 'cautious_saver';
  } else if (riskScore <= 7) {
    persona = 'balanced_builder';
  } else {
    persona = 'growth_seeker';
  }

  return { riskScore, persona };
}
