/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Virtual On-Screen Joystick & Action Buttons
 * For Mobile, Tablet, and Interactive Flat Panel (IFP) classrooms
 */

import React, { useRef, useState, useEffect } from 'react';

interface VirtualControlsProps {
  onJoystickMove: (x: number, y: number, active: boolean) => void;
  onJump: () => void;
  onInteract: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onJoystickMove,
  onJump,
  onInteract,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const radius = 45; // max joystick pull radius

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);
    updateKnob(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        onJoystickMove(0, 0, false);
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const clampedDist = Math.min(dist, radius);
    const angle = Math.atan2(deltaY, deltaX);

    const x = Math.cos(angle) * clampedDist;
    const y = Math.sin(angle) * clampedDist;

    setKnobPos({ x, y });

    // Normalized outputs (-1 to 1)
    const normX = x / radius;
    const normY = -y / radius; // inverted so up is positive
    onJoystickMove(normX, normY, true);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {/* VIRTUAL JOYSTICK (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-28 h-28 rounded-full bg-slate-900/60 border-2 border-slate-700/80 backdrop-blur-md flex items-center justify-center touch-none shadow-2xl active:border-emerald-500/60 transition-colors"
        >
          {/* Outer compass marks */}
          <div className="absolute top-1 text-[10px] text-slate-500 font-bold">W</div>
          <div className="absolute bottom-1 text-[10px] text-slate-500 font-bold">S</div>
          <div className="absolute left-1 text-[10px] text-slate-500 font-bold">A</div>
          <div className="absolute right-1 text-[10px] text-slate-500 font-bold">D</div>

          {/* Draggable Knob */}
          <div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 border border-emerald-300 shadow-lg pointer-events-none transition-transform"
            style={{
              transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`,
            }}
          />
        </div>
      </div>

      {/* VIRTUAL ACTION BUTTONS (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-end gap-3">
        {/* INTERACTION BUTTON [E] */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onInteract();
          }}
          onClick={onInteract}
          className="w-16 h-16 rounded-2xl bg-emerald-600/90 active:bg-emerald-500 border-2 border-emerald-300/60 text-white font-extrabold shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 touch-none"
        >
          <span className="text-sm font-black">E</span>
          <span className="text-[10px] text-emerald-200">Aksi</span>
        </button>

        {/* JUMP BUTTON */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onJump();
          }}
          onClick={onJump}
          className="w-14 h-14 rounded-2xl bg-teal-600/85 active:bg-teal-500 border-2 border-teal-300/60 text-white font-bold shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 touch-none"
        >
          <span className="text-xs font-black">▲</span>
          <span className="text-[9px] text-teal-200">Lompat</span>
        </button>
      </div>
    </div>
  );
};
