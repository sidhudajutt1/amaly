import { Audio, AVPlaybackStatus } from 'expo-av';
import type { ReciterId } from '../types';

const RECITER_FOLDERS: Record<ReciterId, string> = {
  alafasy: 'Alafasy_128kbps',
  husary: 'Husary_128kbps',
  minshawi: 'Minshawi_Murattal_128kbps',
  abdulbasit: 'Abdul_Basit_Murattal_128kbps',
  sudais: 'Abdurrahmaan_As-Sudais_192kbps',
  shuraim: 'Saood_ash-Shuraym_128kbps',
};

function pad3(n: number): string {
  return n.toString().padStart(3, '0');
}

export function getAyahAudioUrl(reciter: ReciterId, surah: number, ayah: number): string {
  const folder = RECITER_FOLDERS[reciter];
  return `https://everyayah.com/data/${folder}/${pad3(surah)}${pad3(ayah)}.mp3`;
}

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface AudioPlayer {
  state: PlaybackState;
  currentAyah: number | null;
  play: (surah: number, ayah: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  playFullSurah: (surah: number, totalAyahs: number, startAyah?: number) => Promise<void>;
  cleanup: () => Promise<void>;
}

let soundInstance: Audio.Sound | null = null;
let isCleaningUp = false;

async function unloadCurrent(): Promise<void> {
  if (soundInstance) {
    try {
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
    } catch {
      // already unloaded
    }
    soundInstance = null;
  }
}

export function createAudioPlayer(
  reciter: ReciterId,
  onStateChange: (state: PlaybackState, ayah: number | null) => void,
): AudioPlayer {
  let currentAyah: number | null = null;
  let surahQueue: { surah: number; ayahs: number[]; index: number } | null = null;
  let state: PlaybackState = 'idle';

  function setState(newState: PlaybackState, ayah: number | null) {
    state = newState;
    currentAyah = ayah;
    onStateChange(newState, ayah);
  }

  async function loadAndPlay(surah: number, ayah: number): Promise<void> {
    await unloadCurrent();
    setState('loading', ayah);

    try {
      const url = getAyahAudioUrl(reciter, surah, ayah);
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
        (status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish && !isCleaningUp) {
            onAyahFinished();
          }
        },
      );
      soundInstance = sound;
      setState('playing', ayah);
    } catch {
      setState('error', ayah);
    }
  }

  function onAyahFinished() {
    if (surahQueue && surahQueue.index < surahQueue.ayahs.length - 1) {
      surahQueue.index++;
      const nextAyah = surahQueue.ayahs[surahQueue.index];
      loadAndPlay(surahQueue.surah, nextAyah);
    } else {
      surahQueue = null;
      setState('idle', null);
    }
  }

  return {
    get state() { return state; },
    get currentAyah() { return currentAyah; },

    async play(surah: number, ayah: number) {
      surahQueue = null;
      await loadAndPlay(surah, ayah);
    },

    async pause() {
      if (soundInstance && state === 'playing') {
        await soundInstance.pauseAsync();
        setState('paused', currentAyah);
      }
    },

    async resume() {
      if (soundInstance && state === 'paused') {
        await soundInstance.playAsync();
        setState('playing', currentAyah);
      }
    },

    async stop() {
      surahQueue = null;
      await unloadCurrent();
      setState('idle', null);
    },

    async playFullSurah(surah: number, totalAyahs: number, startAyah = 1) {
      const ayahs = Array.from({ length: totalAyahs - startAyah + 1 }, (_, i) => startAyah + i);
      surahQueue = { surah, ayahs, index: 0 };
      await loadAndPlay(surah, ayahs[0]);
    },

    async cleanup() {
      isCleaningUp = true;
      surahQueue = null;
      await unloadCurrent();
      setState('idle', null);
      isCleaningUp = false;
    },
  };
}
