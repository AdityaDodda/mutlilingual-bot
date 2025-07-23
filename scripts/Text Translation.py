import sys
import os
import deepl

# Use the same API key as the PPT script (replace with env var if needed)
DEEPL_API_KEY = "10c68e12-3700-4aa2-9b08-88565359ad25:fx"  # <-- Replace with your actual key or use os.environ.get('DEEPL_API_KEY')

def main():
    if len(sys.argv) < 3:
        print(f"Usage: python {sys.argv[0]} <text> <target_lang> [<source_lang>]", file=sys.stderr)
        sys.exit(1)

    text = sys.argv[1]
    target_lang = sys.argv[2]
    source_lang = sys.argv[3] if len(sys.argv) > 3 else None

    try:
        translator = deepl.Translator(DEEPL_API_KEY)
        # DeepL uses uppercase language codes, e.g., 'EN', 'FR', 'DE', etc.
        result = translator.translate_text(
            text,
            source_lang=source_lang.upper() if source_lang else None,
            target_lang=target_lang.upper()
        )
        print(result.text)
    except Exception as e:
        print(f"Translation error: {e}", file=sys.stderr)
        sys.exit(2)

if __name__ == "__main__":
    main()
