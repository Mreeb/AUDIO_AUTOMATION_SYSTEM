import os
import sys
import argparse
from pathlib import Path

# Force UTF-8 encoding for Windows console to handle Hindi / Indic script safely
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from core.transcriber import AudioTranscriber

def main():
    parser = argparse.ArgumentParser(
        description="Phase 1: Accurate Audio Transcription System (AI4Bharat IndicConformer ASR)"
    )
    parser.add_argument(
        "--input", "-i",
        type=str,
        default="AUDIOS",
        help="Input folder containing audio files (default: AUDIOS)"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default="OUTPUTS",
        help="Output directory for transcriptions (default: OUTPUTS)"
    )
    parser.add_argument(
        "--engine", "-e",
        type=str,
        default="indic-conformer",
        choices=["indic-conformer", "whisper"],
        help="ASR engine: 'indic-conformer' (AI4Bharat raw Indic ASR) or 'whisper'"
    )
    parser.add_argument(
        "--lang", "-l",
        type=str,
        default="hi",
        help="Target language code (e.g. 'hi' for Hindi, 'ta' for Tamil, etc.). Default: hi"
    )

    args = parser.parse_args()

    input_dir = Path(args.input)
    output_dir = Path(args.output)

    if not input_dir.exists():
        print(f"[Error] Input directory '{input_dir}' does not exist!")
        sys.exit(1)

    # Find supported audio files
    valid_exts = {".aac", ".mp3", ".wav", ".m4a", ".ogg", ".flac", ".wma"}
    audio_files = [f for f in input_dir.iterdir() if f.is_file() and f.suffix.lower() in valid_exts]

    if not audio_files:
        print(f"[Warning] No supported audio files found in '{input_dir}'.")
        print(f"Supported formats: {', '.join(valid_exts)}")
        sys.exit(0)

    print("=" * 75)
    print("  AUDIO AUTOMATION SYSTEM - AI4BHARAT INDICCONFORMER RAW ASR")
    print("=" * 75)
    print(f" Target Directory: {input_dir.resolve()}")
    print(f" Output Directory: {output_dir.resolve()}")
    print(f" Selected Engine:  {args.engine.upper()}")
    print(f" Target Language:  {args.lang}")
    print(f" Audios Found:     {len(audio_files)} files ({', '.join(f.name for f in audio_files)})")
    print("=" * 75)

    # Initialize Engine
    transcriber = AudioTranscriber(
        engine=args.engine,
        device="cpu"
    )

    results = []
    for idx, audio in enumerate(audio_files, 1):
        print(f"\n({idx}/{len(audio_files)}) Processing '{audio.name}'...")
        try:
            res = transcriber.transcribe(
                audio_path=str(audio),
                language=args.lang
            )
            
            # Export output files
            exported = AudioTranscriber.export_all(res, str(output_dir))
            results.append((res, exported))

            print("-" * 60)
            print(f"RAW TRANSCRIPT PREVIEW FOR [{audio.name}]:")
            print(f"\"{res['full_text']}\"")
            print("-" * 60)

        except Exception as e:
            print(f"[ERROR] Failed to process '{audio.name}': {e}")
            import traceback
            traceback.print_exc()

    print("\n" + "=" * 75)
    print("                     PROCESSING COMPLETE")
    print("=" * 75)
    print(f"Successfully processed {len(results)} / {len(audio_files)} audio files.")
    print(f"All raw transcripts, subtitles (.srt, .vtt), and JSON metadata saved to:")
    print(f"  --> {output_dir.resolve()}\n")

if __name__ == "__main__":
    main()
