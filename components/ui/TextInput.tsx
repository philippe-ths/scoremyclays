import { forwardRef, useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  color,
  fontFamily,
  fontSize,
  radius,
  space,
} from '@/lib/design-system';
import { BodySm, Label } from './Typography';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { label, helperText, errorText, containerStyle, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const hasError = !!errorText;

  const borderColor = hasError
    ? color.miss
    : focused
      ? color.primary
      : color.border2;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Label style={styles.label}>{label}</Label> : null}
      <RNTextInput
        ref={ref}
        placeholderTextColor={color.fg4}
        style={[
          styles.input,
          {
            borderColor,
            borderWidth: focused || hasError ? 1.5 : 1,
          },
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {hasError ? (
        <BodySm tone="danger" style={styles.helper}>
          {errorText}
        </BodySm>
      ) : helperText ? (
        <BodySm tone="meta" style={styles.helper}>
          {helperText}
        </BodySm>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: space[1],
  },
  label: {
    marginBottom: space[1],
  },
  input: {
    minHeight: 48,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    backgroundColor: color.bgElevated,
    borderRadius: radius.md,
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: color.fg1,
  },
  helper: {
    marginTop: space[1],
  },
});
