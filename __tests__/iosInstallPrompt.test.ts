import { shouldShowIOSInstallPrompt } from '@/lib/iosInstallPrompt';

const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const IPHONE_CHROME =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.0.0 Mobile/15E148 Safari/604.1';
const IPAD_SAFARI =
  'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36';
const MAC_SAFARI =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';

describe('shouldShowIOSInstallPrompt', () => {
  it('shows prompt for iPhone Safari, not standalone, not dismissed', () => {
    expect(
      shouldShowIOSInstallPrompt({
        userAgent: IPHONE_SAFARI,
        isStandalone: false,
        dismissed: false,
      })
    ).toBe(true);
  });

  it('shows prompt for iPad Safari', () => {
    expect(
      shouldShowIOSInstallPrompt({
        userAgent: IPAD_SAFARI,
        isStandalone: false,
        dismissed: false,
      })
    ).toBe(true);
  });

  it('hides prompt when running in standalone mode (already installed)', () => {
    expect(
      shouldShowIOSInstallPrompt({
        userAgent: IPHONE_SAFARI,
        isStandalone: true,
        dismissed: false,
      })
    ).toBe(false);
  });

  it('hides prompt when previously dismissed', () => {
    expect(
      shouldShowIOSInstallPrompt({
        userAgent: IPHONE_SAFARI,
        isStandalone: false,
        dismissed: true,
      })
    ).toBe(false);
  });

  it('hides prompt for Chrome on iOS (cannot install via Safari flow)', () => {
    expect(
      shouldShowIOSInstallPrompt({
        userAgent: IPHONE_CHROME,
        isStandalone: false,
        dismissed: false,
      })
    ).toBe(false);
  });

  it('hides prompt for Android Chrome', () => {
    expect(
      shouldShowIOSInstallPrompt({
        userAgent: ANDROID_CHROME,
        isStandalone: false,
        dismissed: false,
      })
    ).toBe(false);
  });

  it('hides prompt for desktop Safari', () => {
    expect(
      shouldShowIOSInstallPrompt({
        userAgent: MAC_SAFARI,
        isStandalone: false,
        dismissed: false,
      })
    ).toBe(false);
  });
});
