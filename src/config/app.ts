export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz6_hmNogiRhIAkAdfWU9q0wQb2WdEvswPCTHCd9U-giehtMTgKcmZq2NsQES-XYuxd/exec";

export const LENIS_OPTIONS = {
  autoRaf: true,
  smoothWheel: true,
  duration: 1.2,
  wheelMultiplier: 0.9,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  syncTouch: true,
  syncTouchLerp: 0.15,
  touchMultiplier: 1.2,
  touchInertiaExponent: 1.55,
};
