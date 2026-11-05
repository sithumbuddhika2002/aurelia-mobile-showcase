#!/usr/bin/env python3
"""
AURELIA MOBILE ATELIER — Modern, Professional, Cinematic Soundtrack Generator
-----------------------------------------------------------------------------
Synthesizes a 32-second, seamless-looping, ultra-luxury cinematic soundtrack:
- Rich felt piano / Rhodes chords (Fm9 -> Dbmaj9 -> Bbm9 -> Csus4/Cadd9)
- Analog orchestral string pad with detuned unison & gentle LFO filter
- Deep cinematic sub-bass foundation (43Hz - 87Hz)
- High crystalline shimmer & atmospheric space
- Stereo algorithmic studio reverb & soft tape saturation
- Seamless circular crossfade for endless, glitch-free luxury playback
"""

import math
import os
import subprocess
import sys
from pathlib import Path
import numpy as np
from scipy import signal

SAMPLE_RATE = 48000
DURATION = 32.0  # seconds
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)
t = np.linspace(0, DURATION, TOTAL_SAMPLES, endpoint=False)


def adsr(total_len, attack=0.8, decay=1.5, sustain=0.6, release=2.0):
    a_s = int(attack * SAMPLE_RATE)
    d_s = int(decay * SAMPLE_RATE)
    r_s = int(release * SAMPLE_RATE)
    s_s = max(0, total_len - a_s - d_s - r_s)

    a_curve = (1 - np.cos(np.linspace(0, np.pi, a_s))) * 0.5
    d_curve = np.linspace(1.0, sustain, d_s)
    s_curve = np.full(s_s, sustain)
    r_curve = (1 + np.cos(np.linspace(0, np.pi, r_s))) * 0.5 * sustain

    env = np.concatenate([a_curve, d_curve, s_curve, r_curve])
    if len(env) < total_len:
        env = np.pad(env, (0, total_len - len(env)))
    return env[:total_len]


# Fast vectorized stereo reverb with scipy.signal.lfilter
def schroeder_reverb_fast(audio_stereo, room_size=0.84, damping=0.25):
    left = audio_stereo[0].copy()
    right = audio_stereo[1].copy()

    # Comb delays in samples at 48kHz
    delays_l = [1557, 1617, 1491, 1422]
    delays_r = [1583, 1643, 1511, 1447]

    def comb_vectorized(sig_in, delay, feedback):
        # Transfer function: H(z) = 1 / (1 - feedback * z^(-delay))
        # b = [1], a = [1, 0, 0, ..., -feedback]
        a = np.zeros(delay + 1, dtype=np.float64)
        a[0] = 1.0
        a[delay] = -feedback * (1.0 - damping)
        return signal.lfilter([1.0], a, sig_in)

    comb_out_l = (
        sum(comb_vectorized(left, d, room_size) for d in delays_l) * 0.25
    )
    comb_out_r = (
        sum(comb_vectorized(right, d, room_size) for d in delays_r) * 0.25
    )

    # 2 Allpass filters for stereo diffusion
    for ap_delay in [225, 556]:
        b = np.zeros(ap_delay + 1, dtype=np.float64)
        a = np.zeros(ap_delay + 1, dtype=np.float64)
        g = 0.55
        b[0] = -g
        b[ap_delay] = 1.0
        a[0] = 1.0
        a[ap_delay] = -g
        comb_out_l = signal.lfilter(b, a, comb_out_l)
        comb_out_r = signal.lfilter(b, a, comb_out_r)

    mix_left = 0.68 * left + 0.32 * comb_out_l
    mix_right = 0.68 * right + 0.32 * comb_out_r
    return np.array([mix_left, mix_right])


def main():
    print("Composing Modern Cinematic Luxury Soundtrack for Aurelia Mobile...")

    left_bus = np.zeros(TOTAL_SAMPLES, dtype=np.float64)
    right_bus = np.zeros(TOTAL_SAMPLES, dtype=np.float64)

    # Chord Progression: 4 bars of 8 seconds each
    # Bar 1 (0-8s): Fm9 (F, Ab, C, Eb, G)
    # Bar 2 (8-16s): Dbmaj9 (Db, F, Ab, C, Eb)
    # Bar 3 (16-24s): Bbm9 (Bb, Db, F, Ab, C)
    # Bar 4 (24-32s): Csus4(add9) resolving smoothly into Fm9
    chords = [
        (
            0.0,
            8.0,
            43.65,
            [87.31, 174.61, 207.65, 261.63, 311.13, 392.00, 523.25],
        ),  # Fm9
        (
            8.0,
            8.0,
            69.30,
            [138.59, 174.61, 207.65, 261.63, 311.13, 392.00, 622.25],
        ),  # Dbmaj9
        (
            16.0,
            8.0,
            58.27,
            [116.54, 138.59, 174.61, 207.65, 261.63, 349.23, 466.16],
        ),  # Bbm9
        (
            24.0,
            8.0,
            65.41,
            [130.81, 174.61, 196.00, 261.63, 293.66, 392.00, 523.25],
        ),  # Csus4(add9)
    ]

    # 1. LAYER 1: Deep Cinematic Sub-Bass (Mono centered warmth)
    for start_t, dur, root_f, _ in chords:
        s_idx = int(start_t * SAMPLE_RATE)
        e_idx = int((start_t + dur) * SAMPLE_RATE)
        length = e_idx - s_idx
        local_t = np.linspace(0, dur, length, endpoint=False)

        env = adsr(length, attack=1.2, decay=1.0, sustain=0.85, release=1.8)
        sub = (
            np.sin(2 * np.pi * root_f * local_t) * 0.75
            + np.sin(2 * np.pi * root_f * 2 * local_t) * 0.25
        )
        sub = np.tanh(sub * 1.3) * env * 0.28

        left_bus[s_idx:e_idx] += sub
        right_bus[s_idx:e_idx] += sub

    # 2. LAYER 2: Warm Cinematic Analog String Pad (Lush detuned stereo)
    for start_t, dur, _, freqs in chords:
        s_idx = int(start_t * SAMPLE_RATE)
        e_idx = int((start_t + dur) * SAMPLE_RATE)
        length = e_idx - s_idx
        local_t = np.linspace(0, dur, length, endpoint=False)
        env = adsr(length, attack=2.2, decay=1.2, sustain=0.78, release=2.6)

        pad_l = np.zeros(length)
        pad_r = np.zeros(length)

        for idx, f in enumerate(freqs[:5]):
            detune1 = 1.0025 + (idx % 2) * 0.0012
            detune2 = 0.9975 - (idx % 2) * 0.0012

            osc_l = np.sin(2 * np.pi * (f * detune1) * local_t) + 0.3 * np.sin(
                2 * np.pi * (f * detune1 * 2) * local_t
            )
            osc_r = np.sin(2 * np.pi * (f * detune2) * local_t) + 0.3 * np.sin(
                2 * np.pi * (f * detune2 * 2) * local_t
            )

            pad_l += osc_l * (1.0 / (idx + 1) ** 0.8)
            pad_r += osc_r * (1.0 / (idx + 1) ** 0.8)

        b, a = signal.butter(2, 580 / (SAMPLE_RATE / 2), btype="low")
        pad_l = signal.lfilter(b, a, pad_l) * env * 0.18
        pad_r = signal.lfilter(b, a, pad_r) * env * 0.18

        left_bus[s_idx:e_idx] += pad_l
        right_bus[s_idx:e_idx] += pad_r

    # 3. LAYER 3: Felt Piano / Rhodes Melody Notes (Apple Pro aesthetic)
    piano_notes = [
        (1.0, 523.25, 0.22, -0.2),  # C5
        (2.8, 392.00, 0.18, 0.2),  # G4
        (4.2, 311.13, 0.16, -0.1),  # Eb4
        (5.8, 349.23, 0.15, 0.15),  # F4
        (9.0, 622.25, 0.24, 0.25),  # Eb5
        (11.2, 523.25, 0.19, -0.2),  # C5
        (13.0, 392.00, 0.17, 0.1),  # G4
        (14.5, 349.23, 0.15, -0.15),  # F4
        (17.0, 466.16, 0.22, -0.25),  # Bb4
        (19.2, 349.23, 0.18, 0.2),  # F4
        (21.0, 311.13, 0.16, -0.1),  # Eb4
        (22.8, 261.63, 0.15, 0.1),  # C4
        (25.0, 587.33, 0.23, 0.2),  # D5
        (27.0, 523.25, 0.20, -0.2),  # C5
        (29.0, 392.00, 0.18, 0.1),  # G4
        (30.5, 349.23, 0.16, -0.1),  # F4
    ]

    for p_time, freq, vel, pan in piano_notes:
        s_idx = int(p_time * SAMPLE_RATE)
        dur = 4.5
        e_idx = min(TOTAL_SAMPLES, s_idx + int(dur * SAMPLE_RATE))
        length = e_idx - s_idx
        if length <= 0:
            continue
        p_t = np.linspace(0, length / SAMPLE_RATE, length, endpoint=False)

        piano_tone = (
            np.sin(2 * np.pi * freq * p_t) * np.exp(-p_t * 1.6)
            + 0.4 * np.sin(2 * np.pi * freq * 2 * p_t) * np.exp(-p_t * 2.8)
            + 0.15 * np.sin(2 * np.pi * freq * 3 * p_t) * np.exp(-p_t * 4.2)
            + 0.05 * np.sin(2 * np.pi * freq * 4 * p_t) * np.exp(-p_t * 6.0)
        )
        piano_tone *= vel

        left_gain = math.sqrt(0.5 * (1.0 - pan))
        right_gain = math.sqrt(0.5 * (1.0 + pan))

        left_bus[s_idx:e_idx] += piano_tone * left_gain
        right_bus[s_idx:e_idx] += piano_tone * right_gain

    # 4. LAYER 4: High Crystalline Celestial Shimmer
    shimmer_chords = [
        (0.0, 8.0, [1046.50, 1567.98]),
        (8.0, 8.0, [1244.51, 1661.22]),
        (16.0, 8.0, [932.33, 1396.91]),
        (24.0, 8.0, [1174.66, 1567.98]),
    ]
    for start_t, dur, freqs in shimmer_chords:
        s_idx = int(start_t * SAMPLE_RATE)
        e_idx = int((start_t + dur) * SAMPLE_RATE)
        length = e_idx - s_idx
        local_t = np.linspace(0, dur, length, endpoint=False)
        env = adsr(length, attack=3.0, decay=1.0, sustain=0.6, release=3.0)

        for f in freqs:
            vib = np.sin(2 * np.pi * 3.5 * local_t) * 1.8
            tone_l = np.sin(2 * np.pi * (f + vib) * local_t) * env * 0.035
            tone_r = (
                np.sin(2 * np.pi * (f + vib * 1.05 + 1.2) * local_t)
                * env
                * 0.035
            )

            left_bus[s_idx:e_idx] += tone_l
            right_bus[s_idx:e_idx] += tone_r

    # 5. Master Bus Processing: Reverb
    raw_stereo = np.array([left_bus, right_bus])
    reverbed = schroeder_reverb_fast(raw_stereo, room_size=0.84, damping=0.25)

    # 6. Make Seamless Loop (Circular Crossfade over 2.5 seconds)
    xfade_samples = int(2.5 * SAMPLE_RATE)
    fade_in = (1 - np.cos(np.linspace(0, np.pi, xfade_samples))) * 0.5
    fade_out = 1.0 - fade_in

    tail_l = reverbed[0, -xfade_samples:].copy()
    tail_r = reverbed[1, -xfade_samples:].copy()

    head_l = reverbed[0, :xfade_samples].copy()
    head_r = reverbed[1, :xfade_samples].copy()

    reverbed[0, :xfade_samples] = head_l * fade_in + tail_l * fade_out
    reverbed[1, :xfade_samples] = head_r * fade_in + tail_r * fade_out

    final_l = reverbed[0, :-xfade_samples]
    final_r = reverbed[1, :-xfade_samples]

    # Normalize and soft analog tape saturation
    peak = max(np.max(np.abs(final_l)), np.max(np.abs(final_r)), 0.001)
    target_peak = 0.88
    final_l = np.tanh((final_l / peak) * 0.95) * target_peak
    final_r = np.tanh((final_r / peak) * 0.95) * target_peak

    output_dir = Path(__file__).resolve().parent.parent / "public" / "audio"
    output_dir.mkdir(parents=True, exist_ok=True)
    temp_wav = output_dir / "temp_cinematic.wav"
    output_mp3 = output_dir / "cinematic-luxury.mp3"

    int_data = np.vstack([final_l, final_r]).T
    int_data = np.clip(int_data * 32767, -32768, 32767).astype(np.int16)

    import wave

    with wave.open(str(temp_wav), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(int_data.tobytes())

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(temp_wav),
            "-c:a",
            "libmp3lame",
            "-b:a",
            "256k",
            str(output_mp3),
        ],
        check=True,
    )

    if temp_wav.exists():
        temp_wav.unlink()

    print(f"Successfully created Modern Cinematic Soundtrack: {output_mp3}")


if __name__ == "__main__":
    main()
