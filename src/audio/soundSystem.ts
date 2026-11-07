/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Web Audio API Procedural Sound Engine
 * Zero external audio files, 100% synthesized in real time.
 */

import { DATA_SUARA } from './openingMusic';
import { DATA_SUARA_LEVEL1 } from './level1Music';
import { DATA_SUARA_LEVEL2 } from './level2Music';
import { DATA_SUARA_LEVEL3 } from './level3Music';
import { DATA_SUARA_LEVEL4 } from './level4Music';
import { DATA_SUARA_LEVEL5 } from './level5Music';
import { DATA_SUARA_LEVEL6 } from './level6Music';
import { DATA_SUARA_TRANSISI } from './transitionMusic';

class SoundSystem {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isBgmRunning = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmIntervalId: number | null = null;

  private openingAudio: HTMLAudioElement | null = null;
  public isOpeningPlaying = false;

  private transitionAudio: HTMLAudioElement | null = null;
  public isTransitionPlaying = false;

  private level1Audio: HTMLAudioElement | null = null;
  public isLevel1Playing = false;

  private level2Audio: HTMLAudioElement | null = null;
  public isLevel2Playing = false;

  private level3Audio: HTMLAudioElement | null = null;
  public isLevel3Playing = false;

  private level4Audio: HTMLAudioElement | null = null;
  public isLevel4Playing = false;

  private level5Audio: HTMLAudioElement | null = null;
  public isLevel5Playing = false;

  private level6Audio: HTMLAudioElement | null = null;
  public isLevel6Playing = false;

  public volume = 0.7;
  public isMuted = false;
  public isBgmMuted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isBgmMuted ? 0 : 0.25, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.openingAudio) {
      this.openingAudio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
    if (this.level1Audio) {
      this.level1Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
    if (this.level2Audio) {
      this.level2Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
    if (this.level3Audio) {
      this.level3Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
    if (this.level4Audio) {
      this.level4Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
    if (this.level5Audio) {
      this.level5Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
    if (this.level6Audio) {
      this.level6Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
    if (this.transitionAudio) {
      this.transitionAudio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.openingAudio) {
      this.openingAudio.muted = muted;
    }
    if (this.transitionAudio) {
      this.transitionAudio.muted = muted;
    }
    if (this.level1Audio) {
      this.level1Audio.muted = muted;
    }
    if (this.level2Audio) {
      this.level2Audio.muted = muted;
    }
    if (this.level3Audio) {
      this.level3Audio.muted = muted;
    }
    if (this.level4Audio) {
      this.level4Audio.muted = muted;
    }
    if (this.level5Audio) {
      this.level5Audio.muted = muted;
    }
    if (this.level6Audio) {
      this.level6Audio.muted = muted;
    }
  }

  public setBgmMute(muted: boolean) {
    this.isBgmMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(muted ? 0 : 0.25, this.ctx.currentTime, 0.05);
    }
    if (this.openingAudio) {
      this.openingAudio.muted = muted || this.isMuted;
    }
    if (this.transitionAudio) {
      this.transitionAudio.muted = muted || this.isMuted;
    }
    if (this.level1Audio) {
      this.level1Audio.muted = muted || this.isMuted;
    }
    if (this.level2Audio) {
      this.level2Audio.muted = muted || this.isMuted;
    }
    if (this.level3Audio) {
      this.level3Audio.muted = muted || this.isMuted;
    }
    if (this.level4Audio) {
      this.level4Audio.muted = muted || this.isMuted;
    }
    if (this.level5Audio) {
      this.level5Audio.muted = muted || this.isMuted;
    }
    if (this.level6Audio) {
      this.level6Audio.muted = muted || this.isMuted;
    }
  }

  public playOpeningMusic(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.openingAudio) {
        if (DATA_SUARA && DATA_SUARA['OPENING OK']) {
          this.openingAudio = new Audio(DATA_SUARA['OPENING OK']);
          this.openingAudio.loop = true;
          this.openingAudio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.openingAudio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.openingAudio) {
        this.openingAudio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.openingAudio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.openingAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isOpeningPlaying = true;
            })
            .catch((err) => {
              // Expected if user hasn't interacted yet
              console.log('Audio autoplay prevented or waiting for user interaction:', err);
              this.isOpeningPlaying = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play opening audio:', e);
    }
    return false;
  }

  public stopOpeningMusic() {
    if (this.openingAudio) {
      try {
        this.openingAudio.pause();
        this.openingAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isOpeningPlaying = false;
  }

  public toggleOpeningMusic(): boolean {
    if (this.isOpeningPlaying && this.openingAudio && !this.openingAudio.paused) {
      this.stopOpeningMusic();
      return false;
    } else {
      this.playOpeningMusic();
      return true;
    }
  }

  public playLevel1Music(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.level1Audio) {
        if (DATA_SUARA_LEVEL1 && DATA_SUARA_LEVEL1['LEVEL 1 OK']) {
          this.level1Audio = new Audio(DATA_SUARA_LEVEL1['LEVEL 1 OK']);
          this.level1Audio.loop = true;
          this.level1Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.level1Audio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.level1Audio) {
        this.level1Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.level1Audio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.level1Audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isLevel1Playing = true;
            })
            .catch((err) => {
              console.log('Level 1 audio autoplay prevented:', err);
              this.isLevel1Playing = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play Level 1 audio:', e);
    }
    return false;
  }

  public stopLevel1Music() {
    if (this.level1Audio) {
      try {
        this.level1Audio.pause();
        this.level1Audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isLevel1Playing = false;
  }

  public toggleLevel1Music(): boolean {
    if (this.isLevel1Playing && this.level1Audio && !this.level1Audio.paused) {
      this.stopLevel1Music();
      return false;
    } else {
      this.playLevel1Music();
      return true;
    }
  }

  public playLevel2Music(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.level2Audio) {
        if (DATA_SUARA_LEVEL2 && DATA_SUARA_LEVEL2['LEVEL 2 OK']) {
          this.level2Audio = new Audio(DATA_SUARA_LEVEL2['LEVEL 2 OK']);
          this.level2Audio.loop = true;
          this.level2Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.level2Audio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.level2Audio) {
        this.level2Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.level2Audio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.level2Audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isLevel2Playing = true;
            })
            .catch((err) => {
              console.log('Level 2 audio autoplay prevented:', err);
              this.isLevel2Playing = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play Level 2 audio:', e);
    }
    return false;
  }

  public stopLevel2Music() {
    if (this.level2Audio) {
      try {
        this.level2Audio.pause();
        this.level2Audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isLevel2Playing = false;
  }

  public toggleLevel2Music(): boolean {
    if (this.isLevel2Playing && this.level2Audio && !this.level2Audio.paused) {
      this.stopLevel2Music();
      return false;
    } else {
      this.playLevel2Music();
      return true;
    }
  }

  public playLevel3Music(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.level3Audio) {
        if (DATA_SUARA_LEVEL3 && DATA_SUARA_LEVEL3['LEVEL 3 MACHINE']) {
          this.level3Audio = new Audio(DATA_SUARA_LEVEL3['LEVEL 3 MACHINE']);
          this.level3Audio.loop = true;
          this.level3Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.level3Audio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.level3Audio) {
        this.level3Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.level3Audio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.level3Audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isLevel3Playing = true;
            })
            .catch((err) => {
              console.log('Level 3 audio autoplay prevented:', err);
              this.isLevel3Playing = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play Level 3 audio:', e);
    }
    return false;
  }

  public stopLevel3Music() {
    if (this.level3Audio) {
      try {
        this.level3Audio.pause();
        this.level3Audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isLevel3Playing = false;
  }

  public toggleLevel3Music(): boolean {
    if (this.isLevel3Playing && this.level3Audio && !this.level3Audio.paused) {
      this.stopLevel3Music();
      return false;
    } else {
      this.playLevel3Music();
      return true;
    }
  }

  public playLevel4Music(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.level4Audio) {
        const audioSrc = (DATA_SUARA_LEVEL4 && (DATA_SUARA_LEVEL4['LEVEL 5 OK'] || Object.values(DATA_SUARA_LEVEL4)[0])) || '';
        if (audioSrc) {
          this.level4Audio = new Audio(audioSrc);
          this.level4Audio.loop = true;
          this.level4Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.level4Audio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.level4Audio) {
        this.level4Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.level4Audio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.level4Audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isLevel4Playing = true;
            })
            .catch((err) => {
              console.log('Level 4 audio autoplay prevented:', err);
              this.isLevel4Playing = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play Level 4 audio:', e);
    }
    return false;
  }

  public stopLevel4Music() {
    if (this.level4Audio) {
      try {
        this.level4Audio.pause();
        this.level4Audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isLevel4Playing = false;
  }

  public toggleLevel4Music(): boolean {
    if (this.isLevel4Playing && this.level4Audio && !this.level4Audio.paused) {
      this.stopLevel4Music();
      return false;
    } else {
      this.playLevel4Music();
      return true;
    }
  }

  public playLevel5Music(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.level5Audio) {
        const audioSrc = (DATA_SUARA_LEVEL5 && (DATA_SUARA_LEVEL5['TRANSISI'] || DATA_SUARA_LEVEL5['LEVEL 5 OK'] || Object.values(DATA_SUARA_LEVEL5)[0])) || '';
        if (audioSrc) {
          this.level5Audio = new Audio(audioSrc);
          this.level5Audio.loop = true;
          this.level5Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.level5Audio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.level5Audio) {
        this.level5Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.level5Audio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.level5Audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isLevel5Playing = true;
            })
            .catch((err) => {
              console.log('Level 5 audio autoplay prevented:', err);
              this.isLevel5Playing = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play Level 5 audio:', e);
    }
    return false;
  }

  public stopLevel5Music() {
    if (this.level5Audio) {
      try {
        this.level5Audio.pause();
        this.level5Audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isLevel5Playing = false;
  }

  public toggleLevel5Music(): boolean {
    if (this.isLevel5Playing && this.level5Audio && !this.level5Audio.paused) {
      this.stopLevel5Music();
      return false;
    } else {
      this.playLevel5Music();
      return true;
    }
  }

  public playLevel6Music(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.level6Audio) {
        const audioSrc = (DATA_SUARA_LEVEL6 && (DATA_SUARA_LEVEL6['LEVEL 6 OK'] || Object.values(DATA_SUARA_LEVEL6)[0])) || '';
        if (audioSrc) {
          this.level6Audio = new Audio(audioSrc);
          this.level6Audio.loop = true;
          this.level6Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.level6Audio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.level6Audio) {
        this.level6Audio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.level6Audio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.level6Audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isLevel6Playing = true;
            })
            .catch((err) => {
              console.log('Level 6 audio autoplay prevented:', err);
              this.isLevel6Playing = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play Level 6 audio:', e);
    }
    return false;
  }

  public stopLevel6Music() {
    if (this.level6Audio) {
      try {
        this.level6Audio.pause();
        this.level6Audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isLevel6Playing = false;
  }

  public toggleLevel6Music(): boolean {
    if (this.isLevel6Playing && this.level6Audio && !this.level6Audio.paused) {
      this.stopLevel6Music();
      return false;
    } else {
      this.playLevel6Music();
      return true;
    }
  }

  public playTransitionMusic(): boolean {
    if (this.isMuted) return false;
    try {
      if (!this.transitionAudio) {
        const audioSrc = (DATA_SUARA_TRANSISI && (DATA_SUARA_TRANSISI['TRANSISI ANTAR GAME - MENEGANGKAN'] || Object.values(DATA_SUARA_TRANSISI)[0])) || '';
        if (audioSrc) {
          this.transitionAudio = new Audio(audioSrc);
          this.transitionAudio.loop = true;
          this.transitionAudio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
          this.transitionAudio.muted = this.isMuted || this.isBgmMuted;
        }
      }

      if (this.transitionAudio) {
        this.transitionAudio.volume = Math.max(0, Math.min(1, this.volume * 0.85));
        this.transitionAudio.muted = this.isMuted || this.isBgmMuted;
        const playPromise = this.transitionAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isTransitionPlaying = true;
            })
            .catch((err) => {
              console.log('Transition audio autoplay prevented or waiting for interaction:', err);
              this.isTransitionPlaying = false;
            });
        }
        return true;
      }
    } catch (e) {
      console.warn('Unable to play Transition audio:', e);
    }
    return false;
  }

  public stopTransitionMusic() {
    if (this.transitionAudio) {
      try {
        this.transitionAudio.pause();
        this.transitionAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.isTransitionPlaying = false;
  }

  public toggleTransitionMusic(): boolean {
    if (this.isTransitionPlaying && this.transitionAudio && !this.transitionAudio.paused) {
      this.stopTransitionMusic();
      return false;
    } else {
      this.playTransitionMusic();
      return true;
    }
  }

  public stopAllBgms() {
    this.stopTransitionMusic();
    this.stopLevel1Music();
    this.stopLevel2Music();
    this.stopLevel3Music();
    this.stopLevel4Music();
    this.stopLevel5Music();
    this.stopLevel6Music();
    this.stopAmbientBgm();
  }

  public playPickup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major triad)
    const now = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + index * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  public playSoftBlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playInteract() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playClawMove() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playLevelFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const chords = [
      { notes: [440, 554.37, 659.25], delay: 0 },
      { notes: [493.88, 622.25, 739.99], delay: 0.18 },
      { notes: [554.37, 698.46, 830.61], delay: 0.36 },
      { notes: [659.25, 830.61, 987.77, 1318.51], delay: 0.54 }
    ];

    const now = this.ctx.currentTime;

    chords.forEach(c => {
      c.notes.forEach(freq => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + c.delay;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.55);
      });
    });
  }

  public playTextBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 80, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Continuous gentle background ambiance (warm Indonesian gamelan-inspired pentatonic harmonic pads)
   */
  public startAmbientBgm() {
    if (this.isBgmRunning) return;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;
    this.isBgmRunning = true;

    // Pentatonic Pelog / Slendro meditative notes (F, G, A, C, D)
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    let noteIdx = 0;

    const playChordStep = () => {
      if (!this.ctx || !this.bgmGain || !this.isBgmRunning) return;

      const now = this.ctx.currentTime;
      const root = scale[noteIdx % scale.length];
      const fifth = scale[(noteIdx + 3) % scale.length];
      noteIdx++;

      [root, fifth].forEach((freq, i) => {
        if (!this.ctx || !this.bgmGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4.2);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 4.5);
      });
    };

    playChordStep();
    this.bgmIntervalId = window.setInterval(playChordStep, 4000);
  }

  public stopAmbientBgm() {
    this.isBgmRunning = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const sound = new SoundSystem();
if (typeof window !== 'undefined') {
  (window as any).__soundSystem = sound;
}
