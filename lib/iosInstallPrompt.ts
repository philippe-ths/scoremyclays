export interface IOSPromptInputs {
  userAgent: string;
  isStandalone: boolean;
  dismissed: boolean;
}

export function shouldShowIOSInstallPrompt(inputs: IOSPromptInputs): boolean {
  if (inputs.isStandalone || inputs.dismissed) return false;

  const ua = inputs.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
  if (!isIOSDevice) return false;

  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
  const isSafari = /Safari/.test(ua) && !isOtherBrowser;

  return isSafari;
}
