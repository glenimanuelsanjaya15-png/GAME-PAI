/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PENJAGA BUMI NUSANTARA — Game Edukasi 3D PAI Fase C (Kelas V & VI)
 * Pengembang: Bachtiar Imani, S.Pd. - SDN 2 Girimarto, Wonogiri (NPA PGRI: 33122211124)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StudentProfile,
  LevelObjective,
  ToastMessage,
  InteractiveObjectInfo,
  InventoryItem,
  AccessibilitySettings,
  RadarHotspot,
} from './types';
import { Nusantara3DEngine } from './game/threeEngine';
import { sound } from './audio/soundSystem';
if (typeof window !== 'undefined') {
  (window as any).__soundSystem = sound;
}
import {
  LEVELS_CONFIG,
  PEDAGOGICAL_DATA,
  RADAR_HOTSPOTS,
} from './data/learningContent';
import { SplashScreen } from './components/SplashScreen';
import { HUD } from './components/HUD';
import { VirtualControls } from './components/VirtualControls';
import { LevelTransitionModal } from './components/LevelTransitionModal';
import { PedagogicalModal } from './components/PedagogicalModal';
import { ClawCraneModal } from './components/ClawCraneModal';
import { RadarInvestigasiModal } from './components/RadarInvestigasiModal';
import { PostTestModal } from './components/PostTestModal';
import { RealActionProjectModal } from './components/RealActionProjectModal';
import { CertificateModal } from './components/CertificateModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { InventoryModal } from './components/InventoryModal';
import { PauseHelpModal } from './components/PauseHelpModal';
import { MissionMapModal } from './components/MissionMapModal';

const LOCAL_STORAGE_KEY = 'penjaga_bumi_profile_v1';

export default function App() {
  // 1. Profile & Persistence State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: 'Ahmad Rayyan',
      grade: '5',
      avatar: 'rayyan',
      highScore: 0,
      totalScore: 0,
      xp: 0,
      ecoCoins: 10,
      currentLevel: 1,
      completedLevels: [],
      lastPlayed: new Date().toISOString(),
    };
  });

  // 2. Screen & Modal States
  const [screen, setScreen] = useState<
    | 'splash'
    | 'gameplay'
    | 'transition'
    | 'pedagogical'
    | 'claw_crane'
    | 'radar_investigasi'
    | 'post_test'
    | 'real_action'
    | 'certificate'
  >('splash');

  const [activeModal, setActiveModal] = useState<
    'none' | 'inventory' | 'accessibility' | 'pause' | 'mission_map'
  >('none');

  // 3. Game Mechanics State
  const [currentLevel, setCurrentLevel] = useState(profile.currentLevel || 1);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(profile.totalScore || 0);
  const [ecoCoins, setEcoCoins] = useState(profile.ecoCoins || 10);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [bonusTimerAnimation, setBonusTimerAnimation] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [objectives, setObjectives] = useState<LevelObjective[]>([]);
  const [proximityPrompt, setProximityPrompt] = useState<InteractiveObjectInfo | null>(null);
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);

  // Radar Hotspots State for Level 6
  const [radarHotspots, setRadarHotspots] = useState<RadarHotspot[]>(RADAR_HOTSPOTS);
  const [selectedRadarId, setSelectedRadarId] = useState<string>('wonogiri');

  // Accessibility
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    volume: 0.7,
    sfxMuted: false,
    bgmMuted: false,
    subtitles: false,
    highContrast: false,
    fontSize: 'normal',
  });

  // 3D Canvas Mount Ref & Engine Instance
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Nusantara3DEngine | null>(null);

  // Save profile to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Relaxed educational timer countdown
  useEffect(() => {
    if (screen !== 'gameplay' || activeModal !== 'none') return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          // Timer naturally resets gently with bonus, giving a peaceful challenge without sudden game over
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, activeModal]);

  // Initialize level objectives based on level and grade
  const initializeObjectives = (lvl: number) => {
    switch (lvl) {
      case 1:
        setObjectives([
          { id: 'l1_tool', text: 'Ambil Alat Penjepit Sampah B3', required: 1, current: 0, completed: false },
          { id: 'l1_organik', text: 'Kumpulkan & Pilah Sampah Organik (Daun/Sisa Buah)', required: 2, current: 0, completed: false },
          { id: 'l1_anorganik', text: 'Kumpulkan & Pilah Sampah Anorganik (Botol/Kaleng)', required: 2, current: 0, completed: false },
          { id: 'l1_b3', text: 'Kumpulkan Limbah B3 Aman (Baterai/Wadah Nyamuk)', required: 2, current: 0, completed: false },
        ]);
        break;
      case 2:
        setObjectives([
          { id: 'l2_glyph', text: 'Kumpulkan Sandi 3R (REDUCE, REUSE, RECYCLE)', required: 3, current: 0, completed: false },
          { id: 'l2_wudhu', text: 'Tutup Keran Tempat Wudhu yang Meluap', required: 1, current: 0, completed: false },
          { id: 'l2_lamp', text: 'Matikan Saklar Lampu Kelas di Siang Hari', required: 1, current: 0, completed: false },
        ]);
        break;
      case 3:
        setObjectives([
          { id: 'l3_claw', text: 'Uji & Pilah 5 Benda di Laboratorium Mesin Capit', required: 5, current: 0, completed: false },
        ]);
        break;
      case 4:
        setObjectives([
          { id: 'l4_gates', text: 'Buka 3 Gerbang Hikmah Keseimbangan Alam', required: 3, current: 0, completed: false },
        ]);
        break;
      case 5:
        setObjectives([
          { id: 'l5_river', text: 'Bersihkan Sampah di Aliran Sungai Hutan', required: 1, current: 0, completed: false },
          { id: 'l5_fire', text: 'Padamkan Sisa Bara Api Unggun dari Jarak Aman', required: 1, current: 0, completed: false },
          { id: 'l5_tree', text: 'Tanam Bibit Pohon Pelindung (Sedekah Jariyah)', required: 1, current: 0, completed: false },
          { id: 'l5_ranger', text: 'Lapor Situasi Hutan ke Pos Pengawas Jagawana', required: 1, current: 0, completed: false },
        ]);
        break;
      case 6:
        setObjectives([
          { id: 'l6_radar', text: 'Investigasi & Tabayyun 6 Stasiun Berita Nusantara', required: 6, current: 0, completed: false },
        ]);
        break;
    }
  };

  // Toast Helper
  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'khalifah' = 'info') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(),
      title,
      message,
      type,
    };
    setActiveToast(newToast);
    if (subtitlesEnabled) {
      setCurrentSubtitle(`${title}: ${message}`);
    }
    setTimeout(() => {
      setActiveToast((current) => (current?.id === newToast.id ? null : current));
    }, 4500);
  };

  // Start Game handler from Splash Screen
  const handleStartGame = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    const startLvl = newProfile.currentLevel || 1;
    setCurrentLevel(startLvl);
    initializeObjectives(startLvl);

    // If resuming from level 2-6 directly, stop opening and start transition music
    if (startLvl > 1) {
      sound.stopOpeningMusic();
      sound.stopAllBgms();
      sound.playTransitionMusic();
    }
    setScreen('transition');
  };

  // Transition to Gameplay (Mulai Level Sekarang)
  const handleProceedFromTransition = () => {
    // Opening & Transition music stop specifically when player starts the level
    sound.stopOpeningMusic();
    sound.stopTransitionMusic();
    sound.stopAllBgms();

    // Play specific music per level: Level 1 music for L1, Level 2 music for L2, Level 3 music for L3, Level 4 music for L4, Level 5 music for L5, Level 6 music for L6, ambient BGM for others
    if (currentLevel === 1) {
      sound.playLevel1Music();
    } else if (currentLevel === 2) {
      sound.playLevel2Music();
    } else if (currentLevel === 3) {
      sound.playLevel3Music();
    } else if (currentLevel === 4) {
      sound.playLevel4Music();
    } else if (currentLevel === 5) {
      sound.playLevel5Music();
    } else if (currentLevel === 6) {
      sound.playLevel6Music();
    } else {
      sound.startAmbientBgm();
    }

    setScreen('gameplay');

    setTimeout(() => {
      if (!canvasMountRef.current) return;

      if (!engineRef.current) {
        // Initialize 3D Engine
        engineRef.current = new Nusantara3DEngine(
          canvasMountRef.current,
          {
            onCollect: handleItemCollect,
            onProximityChange: (info) => setProximityPrompt(info),
            onLevelComplete: handleLevelComplete,
            onClawTrigger: () => setScreen('claw_crane'),
            onRadarTrigger: (hotspotId) => {
              setSelectedRadarId(hotspotId);
              setScreen('radar_investigasi');
            },
            onGateTrigger: (gateNum) => handleGatePuzzle(gateNum),
          },
          currentLevel,
          profile.grade,
          profile.avatar
        );
        engineRef.current.start();
      } else {
        engineRef.current.loadLevel(currentLevel);
      }
    }, 100);
  };

  // Jump to Any Mission from Mission Map (Peta Misi) without prerequisites
  const handleJumpToLevel = (levelNum: number, showBriefing: boolean) => {
    setActiveModal('none');
    setCurrentLevel(levelNum);
    setProfile((prev) => ({ ...prev, currentLevel: levelNum }));
    initializeObjectives(levelNum);
    setTimerSeconds(180);

    sound.stopOpeningMusic();
    sound.stopTransitionMusic();
    sound.stopAllBgms();

    if (showBriefing) {
      sound.playTransitionMusic();
      setScreen('transition');
    } else {
      if (levelNum === 1) {
        sound.playLevel1Music();
      } else if (levelNum === 2) {
        sound.playLevel2Music();
      } else if (levelNum === 3) {
        sound.playLevel3Music();
      } else if (levelNum === 4) {
        sound.playLevel4Music();
      } else if (levelNum === 5) {
        sound.playLevel5Music();
      } else if (levelNum === 6) {
        sound.playLevel6Music();
      } else {
        sound.startAmbientBgm();
      }

      setScreen('gameplay');

      setTimeout(() => {
        if (!canvasMountRef.current) return;

        if (!engineRef.current) {
          engineRef.current = new Nusantara3DEngine(
            canvasMountRef.current,
            {
              onCollect: handleItemCollect,
              onProximityChange: (info) => setProximityPrompt(info),
              onLevelComplete: handleLevelComplete,
              onClawTrigger: () => setScreen('claw_crane'),
              onRadarTrigger: (hotspotId) => {
                setSelectedRadarId(hotspotId);
                setScreen('radar_investigasi');
              },
              onGateTrigger: (gateNum) => handleGatePuzzle(gateNum),
            },
            levelNum,
            profile.grade,
            profile.avatar
          );
          engineRef.current.start();
        } else {
          engineRef.current.loadLevel(levelNum);
        }
      }, 100);
    }

    const targetInfo = LEVELS_CONFIG.find((l) => l.levelNumber === levelNum);
    showToast(
      `Melompat ke Level ${levelNum}!`,
      `Misi ${targetInfo?.title || ''} (${targetInfo?.subtitle || ''})`,
      'khalifah'
    );
  };

  // Handle collecting items / actions
  const handleItemCollect = (item: { id: string; name: string; category: string; points: number; coins: number }) => {
    // Add positive timer bonus
    setTimerSeconds((prev) => prev + 5);
    setBonusTimerAnimation(true);
    setTimeout(() => setBonusTimerAnimation(false), 1500);

    // Update Score & Coins
    const addedScore = item.points;
    const addedCoins = item.coins;
    setScore((prev) => prev + addedScore);
    setEcoCoins((prev) => prev + addedCoins);

    // Update Inventory
    setInventory((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, count: i.count + 1 } : i));
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          category: item.category as any,
          description: `Aksi terpuji khalifah menjaga kelestarian bumi`,
          iconName: item.category,
          count: 1,
        },
      ];
    });

    // Update Objectives
    setObjectives((prev) => {
      let updated = false;
      const next = prev.map((obj) => {
        if (!obj.completed && !updated) {
          // Check matching criteria
          if (
            (item.category === 'organik' && obj.id === 'l1_organik') ||
            (item.category === 'anorganik' && obj.id === 'l1_anorganik') ||
            (item.category === 'b3' && obj.id === 'l1_b3') ||
            (item.category === 'alat' && obj.id === 'l1_tool') ||
            (item.category === 'huruf' && obj.id === 'l2_glyph') ||
            (item.id === 'closed_wudhu_tap' && obj.id === 'l2_wudhu') ||
            (item.id === 'turned_off_light' && obj.id === 'l2_lamp') ||
            (item.id === 'hazard_river_trash' && obj.id === 'l5_river') ||
            (item.id === 'hazard_campfire' && obj.id === 'l5_fire') ||
            (item.id === 'hazard_reboisasi' && obj.id === 'l5_tree') ||
            (item.id === 'report_ranger' && obj.id === 'l5_ranger')
          ) {
            const newCur = obj.current + 1;
            const completed = newCur >= obj.required;
            updated = true;
            return { ...obj, current: newCur, completed };
          }
        }
        return obj;
      });

      // Check if all objectives are completed
      const allDone = next.every((o) => o.completed);
      if (allDone && !prev.every((o) => o.completed)) {
        setTimeout(() => handleLevelComplete(currentLevel), 800);
      }
      return next;
    });

    showToast(
      'Kebaikan Khalifah Terwujud!',
      `${item.name} (+${item.points} Skor, +${item.coins} Koin, +5 Detik)`,
      'success'
    );
  };

  // Handle gate puzzle in Level 4 (Gua Kebijaksanaan)
  const handleGatePuzzle = (gateNum: number) => {
    sound.playSuccess();
    if (engineRef.current) {
      engineRef.current.unlockGate(gateNum);
    }

    setObjectives((prev) => {
      const next = prev.map((obj) => {
        if (obj.id === 'l4_gates') {
          const newCur = Math.min(obj.required, obj.current + 1);
          return { ...obj, current: newCur, completed: newCur >= obj.required };
        }
        return obj;
      });
      if (next.every((o) => o.completed)) {
        setTimeout(() => handleLevelComplete(currentLevel), 1000);
      }
      return next;
    });

    showToast(
      'Gerbang Hikmah Terbuka!',
      `Gerbang ${gateNum} berhasil dibuka dengan sandi amanah. (+350 Skor, +5 Koin)`,
      'khalifah'
    );
  };

  // Claw Crane complete item callback
  const handleClawItemCompleted = (points: number, coins: number, explanation: string) => {
    setScore((prev) => prev + points);
    setEcoCoins((prev) => prev + coins);

    setObjectives((prev) => {
      const next = prev.map((obj) => {
        if (obj.id === 'l3_claw') {
          const newCur = Math.min(obj.required, obj.current + 1);
          return { ...obj, current: newCur, completed: newCur >= obj.required };
        }
        return obj;
      });
      if (next.every((o) => o.completed)) {
        setTimeout(() => {
          setScreen('gameplay');
          handleLevelComplete(currentLevel);
        }, 1200);
      }
      return next;
    });

    showToast('Pemilahan Daur Ulang Selesai', explanation, 'khalifah');
  };

  // Radar Hotspot Verification callback
  const handleVerifyHotspot = (hotspotId: string) => {
    setRadarHotspots((prev) =>
      prev.map((h) => (h.id === hotspotId ? { ...h, verified: true } : h))
    );

    setScore((prev) => prev + 250);
    setEcoCoins((prev) => prev + 4);

    setObjectives((prev) => {
      const next = prev.map((obj) => {
        if (obj.id === 'l6_radar') {
          const newCur = Math.min(obj.required, obj.current + 1);
          return { ...obj, current: newCur, completed: newCur >= obj.required };
        }
        return obj;
      });
      if (next.every((o) => o.completed)) {
        setTimeout(() => {
          setScreen('gameplay');
          handleLevelComplete(currentLevel);
        }, 1500);
      }
      return next;
    });

    showToast('Verifikasi Tabayyun Berhasil!', 'Data lingkungan resmi telah terverifikasi kredibel.', 'success');
  };

  // When a level is finished
  const handleLevelComplete = (lvl: number) => {
    if (lvl === 1) {
      sound.stopLevel1Music();
    } else if (lvl === 2) {
      sound.stopLevel2Music();
    } else if (lvl === 3) {
      sound.stopLevel3Music();
    } else if (lvl === 4) {
      sound.stopLevel4Music();
    } else if (lvl === 5) {
      sound.stopLevel5Music();
    } else if (lvl === 6) {
      sound.stopLevel6Music();
    }
    sound.playLevelFanfare();
    showToast(
      `Alhamdulillah! Misi Level ${lvl} Selesai!`,
      'Menuju Sesi Penguatan Pedagogis & Refleksi Qurani...',
      'khalifah'
    );

    // Update profile
    setProfile((prev) => ({
      ...prev,
      totalScore: score,
      ecoCoins,
      xp: prev.xp + 500,
      completedLevels: Array.from(new Set([...prev.completedLevels, lvl])),
    }));

    setTimeout(() => {
      setScreen('pedagogical');
    }, 1500);
  };

  // Finish pedagogical session and advance to next level or Post-Test
  const handleFinishPedagogical = () => {
    sound.stopAllBgms();
    if (currentLevel < 6) {
      const nextLvl = currentLevel + 1;
      setCurrentLevel(nextLvl);
      initializeObjectives(nextLvl);
      setProfile((prev) => ({ ...prev, currentLevel: nextLvl }));
      sound.playTransitionMusic();
      setScreen('transition');
    } else {
      // Completed all 6 levels -> Advance to Post-Test with Transition Music
      sound.stopAllBgms();
      sound.playTransitionMusic();
      setScreen('post_test');
    }
  };

  // Finish post-test
  const handleFinishPostTest = (postTestScore: number) => {
    sound.stopTransitionMusic();
    setProfile((prev) => ({
      ...prev,
      postTestScore,
      totalScore: prev.totalScore + postTestScore * 10,
    }));
    setScreen('real_action');
  };

  // Finish real action project
  const handleFinishRealAction = () => {
    setProfile((prev) => ({
      ...prev,
      projectCompleted: true,
    }));
    setScreen('certificate');
  };

  // Restart to level 1 or new adventure
  const handleRestart = () => {
    sound.stopAllBgms();
    sound.stopTransitionMusic();
    sound.playOpeningMusic();
    setCurrentLevel(1);
    initializeObjectives(1);
    setScore(0);
    setEcoCoins(10);
    setInventory([]);
    setScreen('splash');
  };

  // Current Level info & Pedagogical data
  const currentLevelInfo = LEVELS_CONFIG.find((l) => l.levelNumber === currentLevel) || LEVELS_CONFIG[0];
  const currentPedagogicalData =
    PEDAGOGICAL_DATA[currentLevel]?.[profile.grade === '5' ? 'v' : 'vi'] ||
    PEDAGOGICAL_DATA[1]['v'];

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 3D WebGL Canvas Mounting Container */}
      <div
        ref={canvasMountRef}
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${
          screen === 'gameplay' || screen === 'claw_crane' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* SPLASH SCREEN */}
      {screen === 'splash' && (
        <div className="absolute inset-0 z-30">
          <SplashScreen
            onStartGame={handleStartGame}
            onOpenMissionMap={() => setActiveModal('mission_map')}
            savedProfile={profile}
          />
        </div>
      )}

      {/* IN-GAME HUD (Zero Viewport Occlusion) */}
      {(screen === 'gameplay' || screen === 'claw_crane') && (
        <HUD
          profile={profile}
          currentLevel={currentLevel}
          levelTitle={currentLevelInfo.title}
          objectives={objectives}
          health={health}
          score={score}
          ecoCoins={ecoCoins}
          timerSeconds={timerSeconds}
          bonusTimerAnimation={bonusTimerAnimation}
          proximityPrompt={proximityPrompt}
          activeToast={activeToast}
          subtitlesEnabled={accessibility.subtitles}
          currentSubtitle={currentSubtitle}
          inventory={inventory}
          onOpenInventory={() => setActiveModal('inventory')}
          onOpenAccessibility={() => setActiveModal('accessibility')}
          onOpenPause={() => setActiveModal('pause')}
          onOpenMissionMap={() => setActiveModal('mission_map')}
          onTriggerInteraction={() => {
            if (engineRef.current) {
              engineRef.current.triggerInteraction();
            }
          }}
        />
      )}

      {/* VIRTUAL JOYSTICK & TOUCH BUTTONS (For Mobile / Tablet / IFP) */}
      {screen === 'gameplay' && (
        <VirtualControls
          onJoystickMove={(x, y, active) => {
            if (engineRef.current) {
              engineRef.current.virtualJoystick = { x, y, active };
            }
          }}
          onJump={() => {
            if (engineRef.current) {
              engineRef.current.triggerJump();
            }
          }}
          onInteract={() => {
            if (engineRef.current) {
              engineRef.current.triggerInteraction();
            }
          }}
        />
      )}

      {/* LEVEL TRANSITION BRIEFING MODAL */}
      {screen === 'transition' && (
        <LevelTransitionModal
          levelInfo={currentLevelInfo}
          grade={profile.grade}
          onProceed={handleProceedFromTransition}
        />
      )}

      {/* PEDAGOGICAL STRENGTHENING MODAL (Level 1 - 6) */}
      {screen === 'pedagogical' && (
        <PedagogicalModal
          data={currentPedagogicalData}
          onComplete={handleFinishPedagogical}
        />
      )}

      {/* LEVEL 3: CLAW CRANE OVERLAY */}
      {screen === 'claw_crane' && (
        <ClawCraneModal
          grade={profile.grade}
          onMoveClaw={(dx, dz) => {
            if (engineRef.current) {
              engineRef.current.moveClaw(dx, dz);
            }
          }}
          onDropClaw={(callback) => {
            if (engineRef.current) {
              engineRef.current.lowerAndGrabClaw(callback);
            }
          }}
          onCompleteItem={handleClawItemCompleted}
          onClose={() => setScreen('gameplay')}
        />
      )}

      {/* LEVEL 6: RADAR INVESTIGASI MODAL */}
      {screen === 'radar_investigasi' && (
        <RadarInvestigasiModal
          hotspots={radarHotspots}
          selectedHotspotId={selectedRadarId}
          onVerifyHotspot={handleVerifyHotspot}
          onClose={() => setScreen('gameplay')}
        />
      )}

      {/* POST-TEST EVALUATION MODAL */}
      {screen === 'post_test' && (
        <PostTestModal
          grade={profile.grade}
          studentName={profile.name}
          onFinishTest={handleFinishPostTest}
        />
      )}

      {/* REAL ACTION PROJECT MODAL */}
      {screen === 'real_action' && (
        <RealActionProjectModal
          profile={profile}
          onProceedToCertificate={handleFinishRealAction}
        />
      )}

      {/* OFFICIAL CERTIFICATE MODAL */}
      {screen === 'certificate' && (
        <CertificateModal
          profile={profile}
          finalScore={profile.postTestScore || 95}
          onRestart={handleRestart}
        />
      )}

      {/* HELPER MODALS: INVENTORY */}
      {activeModal === 'inventory' && (
        <InventoryModal
          items={inventory}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* HELPER MODALS: ACCESSIBILITY */}
      {activeModal === 'accessibility' && (
        <AccessibilityModal
          settings={accessibility}
          onUpdateSettings={(newSettings) => setAccessibility(newSettings)}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* HELPER MODALS: PAUSE & GUIDELINES */}
      {activeModal === 'pause' && (
        <PauseHelpModal
          grade={profile.grade}
          currentLevel={currentLevel}
          onResume={() => setActiveModal('none')}
          onRestartLevel={() => {
            setActiveModal('none');
            initializeObjectives(currentLevel);
            if (engineRef.current) {
              engineRef.current.loadLevel(currentLevel);
            }
          }}
          onOpenMissionMap={() => setActiveModal('mission_map')}
        />
      )}

      {/* PETA MISI MODAL (NAVIGASI BEBAS KHALIFAH NUSANTARA) */}
      {activeModal === 'mission_map' && (
        <MissionMapModal
          currentLevel={currentLevel}
          grade={profile.grade}
          completedLevels={profile.completedLevels}
          onSelectLevel={handleJumpToLevel}
          onOpenPostTest={() => {
            setActiveModal('none');
            sound.stopAllBgms();
            sound.playTransitionMusic();
            setScreen('post_test');
          }}
          onOpenRealAction={() => {
            setActiveModal('none');
            sound.stopAllBgms();
            setScreen('real_action');
          }}
          onClose={() => setActiveModal('none')}
        />
      )}
    </div>
  );
}
