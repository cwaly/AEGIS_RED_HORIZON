import { FC } from 'react';

/**
 * Capa puramente decorativa (scanlines + viñeta CRT + haz de escaneo) montada
 * una sola vez sobre toda la app. pointer-events-none para no interceptar clicks.
 */
export const TacticalOverlay: FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[50] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.55)]" />
      <div className="absolute left-0 right-0 h-32 bg-gradient-to-b from-rose-500/0 via-rose-500/[0.035] to-rose-500/0 animate-scan" />
    </div>
  );
};
