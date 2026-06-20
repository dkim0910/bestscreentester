// Fullscreen + Screen Wake Lock helpers used by the tool stage.

export async function enterFullscreen(el: HTMLElement): Promise<void> {
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
  };
  try {
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (anyEl.webkitRequestFullscreen) await anyEl.webkitRequestFullscreen();
  } catch {
    // Fullscreen can be blocked (e.g. iOS Safari); the tool still works inline.
  }
}

export async function exitFullscreen(): Promise<void> {
  const anyDoc = document as Document & {
    webkitExitFullscreen?: () => Promise<void>;
  };
  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (anyDoc.webkitExitFullscreen) {
      await anyDoc.webkitExitFullscreen();
    }
  } catch {
    // ignore
  }
}

export function isFullscreen(): boolean {
  return Boolean(document.fullscreenElement);
}

// ----- Screen Wake Lock -----

type WakeLockSentinelLike = {
  release: () => Promise<void>;
  released: boolean;
  addEventListener: (type: "release", cb: () => void) => void;
};

export class WakeLock {
  private sentinel: WakeLockSentinelLike | null = null;

  async request(): Promise<boolean> {
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
    };
    if (!nav.wakeLock) return false;
    try {
      this.sentinel = await nav.wakeLock.request("screen");
      return true;
    } catch {
      return false;
    }
  }

  async release(): Promise<void> {
    try {
      await this.sentinel?.release();
    } catch {
      // ignore
    } finally {
      this.sentinel = null;
    }
  }

  get active(): boolean {
    return Boolean(this.sentinel && !this.sentinel.released);
  }
}
