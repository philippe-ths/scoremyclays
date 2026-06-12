import { PresentationType, TargetConfig } from './types';

// --- App limits ---

export const MAX_SQUAD_SIZE = 6;

/** Minimum tap target (logical px). Use design-system `layout.touchTarget` for styled surfaces. */
export const MIN_TAP_TARGET_SIZE = 48;

/** Glove-friendly tap target for the scoring surface. */
export const TOUCH_XL = 72;

// --- Presentation display labels ---

export const PRESENTATION_LABELS: Record<PresentationType, string> = {
  [PresentationType.CROSSER]: 'Crosser',
  [PresentationType.DRIVEN]: 'Driven',
  [PresentationType.INCOMING]: 'Incoming',
  [PresentationType.GOING_AWAY]: 'Going Away',
  [PresentationType.QUARTERING_AWAY]: 'Quartering Away',
  [PresentationType.QUARTERING_TOWARDS]: 'Quartering Towards',
  [PresentationType.TEAL]: 'Teal',
  [PresentationType.DROPPING]: 'Dropping',
  [PresentationType.LOOPER]: 'Looper',
  [PresentationType.RABBIT]: 'Rabbit',
  [PresentationType.BATTUE]: 'Battue',
  [PresentationType.CHANDELLE]: 'Chandelle',
  [PresentationType.SPRINGING]: 'Springing',
};

// --- Target config display labels ---

export const TARGET_CONFIG_LABELS: Record<TargetConfig, string> = {
  [TargetConfig.SINGLE]: 'Single',
  [TargetConfig.REPORT_PAIR]: 'Report Pair',
  [TargetConfig.SIMULTANEOUS_PAIR]: 'Sim Pair',
  [TargetConfig.FOLLOWING_PAIR]: 'Following Pair',
};

export const PRESENTATION_DESCRIPTIONS: Record<PresentationType, string> = {
  [PresentationType.CROSSER]: 'Target flies across the shooter\'s front, left-to-right or right-to-left',
  [PresentationType.DRIVEN]: 'Target comes toward the shooter, rising then falling overhead',
  [PresentationType.INCOMING]: 'Target approaches the shooter at various angles',
  [PresentationType.GOING_AWAY]: 'Target moves away from the shooter',
  [PresentationType.QUARTERING_AWAY]: 'Target moves away at an angle',
  [PresentationType.QUARTERING_TOWARDS]: 'Target approaches at an angle',
  [PresentationType.TEAL]: 'Target rises steeply upward (springing teal)',
  [PresentationType.DROPPING]: 'Target falls or descends',
  [PresentationType.LOOPER]: 'Target rises then curves downward',
  [PresentationType.RABBIT]: 'Target rolls/bounces along the ground',
  [PresentationType.BATTUE]: 'Thin target that turns and drops mid-flight',
  [PresentationType.CHANDELLE]: 'Target rises and curves to one side',
  [PresentationType.SPRINGING]: 'Target launches upward at an angle',
};
