/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColorsTheme, Theme } from './theme.js';
import { SemanticColors } from './semantic-tokens.js';

// Fashion-inspired color palette
export const fashionTheme: ColorsTheme = {
  type: 'dark',
  Background: '#1A1A1A',          // Deep charcoal for elegance
  Foreground: '#F5F5F5',          // Crisp white for text
  LightBlue: '#D4AFDF',           // Soft lavender
  AccentBlue: '#FF69B4',          // Hot pink - fashion statement
  AccentPurple: '#9370DB',        // Medium orchid
  AccentCyan: '#20B2AA',          // Light sea green - mint
  AccentGreen: '#98FB98',         // Pale green - nature inspired
  AccentYellow: '#FFD700',        // Gold - luxury accent
  AccentRed: '#DC143C',           // Crimson - bold statement
  DiffAdded: '#2D5A2D',           // Forest green for additions
  DiffRemoved: '#5A2D2D',         // Burgundy for removals
  Comment: '#B19CD9',             // Light purple for comments
  Gray: '#808080',                // Neutral gray
  GradientColors: ['#FF69B4', '#9370DB', '#20B2AA'], // Hot pink to orchid to mint
};

const fashionSemanticColors: SemanticColors = {
  text: {
    primary: fashionTheme.Foreground,
    secondary: fashionTheme.Gray,
    link: fashionTheme.AccentBlue,
    accent: fashionTheme.AccentPurple,
  },
  background: {
    primary: fashionTheme.Background,
    diff: {
      added: fashionTheme.DiffAdded,
      removed: fashionTheme.DiffRemoved,
    },
  },
  border: {
    default: fashionTheme.Gray,
    focused: fashionTheme.AccentBlue,
  },
  ui: {
    comment: fashionTheme.Comment,
    symbol: fashionTheme.Gray,
    gradient: fashionTheme.GradientColors,
  },
  status: {
    error: fashionTheme.AccentRed,
    success: fashionTheme.AccentGreen,
    warning: fashionTheme.AccentYellow,
  },
};

export const Fashion: Theme = new Theme(
  'Fashion',
  'dark',
  {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      padding: '0.5em',
      background: fashionTheme.Background,
      color: fashionTheme.Foreground,
    },
    'hljs-keyword': {
      color: fashionTheme.AccentBlue,
    },
    'hljs-literal': {
      color: fashionTheme.AccentBlue,
    },
    'hljs-symbol': {
      color: fashionTheme.AccentBlue,
    },
    'hljs-name': {
      color: fashionTheme.AccentBlue,
    },
    'hljs-link': {
      color: fashionTheme.AccentBlue,
      textDecoration: 'underline',
    },
    'hljs-built_in': {
      color: fashionTheme.AccentCyan,
    },
    'hljs-type': {
      color: fashionTheme.AccentCyan,
    },
    'hljs-number': {
      color: fashionTheme.AccentGreen,
    },
    'hljs-class': {
      color: fashionTheme.AccentGreen,
    },
    'hljs-string': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-meta-string': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-regexp': {
      color: fashionTheme.AccentRed,
    },
    'hljs-template-tag': {
      color: fashionTheme.AccentRed,
    },
    'hljs-subst': {
      color: fashionTheme.Foreground,
    },
    'hljs-function': {
      color: fashionTheme.Foreground,
    },
    'hljs-title': {
      color: fashionTheme.Foreground,
    },
    'hljs-params': {
      color: fashionTheme.Foreground,
    },
    'hljs-formula': {
      color: fashionTheme.Foreground,
    },
    'hljs-comment': {
      color: fashionTheme.Comment,
      fontStyle: 'italic',
    },
    'hljs-quote': {
      color: fashionTheme.Comment,
      fontStyle: 'italic',
    },
    'hljs-doctag': {
      color: fashionTheme.Comment,
    },
    'hljs-meta': {
      color: fashionTheme.Gray,
    },
    'hljs-meta-keyword': {
      color: fashionTheme.Gray,
    },
    'hljs-tag': {
      color: fashionTheme.Gray,
    },
    'hljs-variable': {
      color: fashionTheme.AccentPurple,
    },
    'hljs-template-variable': {
      color: fashionTheme.AccentPurple,
    },
    'hljs-attr': {
      color: fashionTheme.LightBlue,
    },
    'hljs-attribute': {
      color: fashionTheme.LightBlue,
    },
    'hljs-builtin-name': {
      color: fashionTheme.LightBlue,
    },
    'hljs-section': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-emphasis': {
      fontStyle: 'italic',
    },
    'hljs-strong': {
      fontWeight: 'bold',
    },
    'hljs-bullet': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-selector-tag': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-selector-id': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-selector-class': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-selector-attr': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-selector-pseudo': {
      color: fashionTheme.AccentYellow,
    },
    'hljs-addition': {
      backgroundColor: fashionTheme.DiffAdded,
      display: 'inline-block',
      width: '100%',
    },
    'hljs-deletion': {
      backgroundColor: fashionTheme.DiffRemoved,
      display: 'inline-block',
      width: '100%',
    },
  },
  fashionTheme,
  fashionSemanticColors,
);