import { Text, type TextProps, type TextStyle } from 'react-native';
import { text as textTokens, color } from '@/lib/design-system';

type Variant =
  | 'displayXl'
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySm'
  | 'meta'
  | 'label'
  | 'score'
  | 'scoreSm'
  | 'mono';

type Tone = 'default' | 'muted' | 'meta' | 'inverse' | 'primary' | 'accent' | 'danger';

const toneColor: Record<Tone, string | undefined> = {
  default: undefined,
  muted: color.fg2,
  meta: color.fg3,
  inverse: color.fgInverse,
  primary: color.primary,
  accent: color.accent,
  danger: color.miss,
};

export interface TypographyProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
}

export function Typography({
  variant = 'body',
  tone = 'default',
  align,
  weight,
  style,
  children,
  ...rest
}: TypographyProps) {
  const toneOverride = toneColor[tone];
  return (
    <Text
      style={[
        textTokens[variant],
        toneOverride ? { color: toneOverride } : null,
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

// Semantic shortcuts for readability at call sites.
export const Display = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="display" {...p} />;
export const DisplayXl = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="displayXl" {...p} />;
export const H1 = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="h1" {...p} />;
export const H2 = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="h2" {...p} />;
export const H3 = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="h3" {...p} />;
export const H4 = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="h4" {...p} />;
export const Body = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="body" {...p} />;
export const BodySm = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="bodySm" {...p} />;
export const Meta = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="meta" {...p} />;
export const Label = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="label" {...p} />;
export const Score = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="score" {...p} />;
export const Mono = (p: Omit<TypographyProps, 'variant'>) => <Typography variant="mono" {...p} />;
