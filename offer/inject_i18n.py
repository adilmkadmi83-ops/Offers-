import re
import json

def process_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # We will use regex to find text nodes.
    # We want to match things like >Some Arabic text<
    # To be safe, we only match text containing Arabic letters.
    arabic_pattern = re.compile(r'>\s*([^<]+?[\u0600-\u06FF]+[^<]*?)\s*<')
    
    translations = {}
    counter = 1
    
    def repl(match):
        nonlocal counter
        text = match.group(1).strip()
        
        # Skip if it's just spaces or very short or already has data-i18n
        if len(text) < 2:
            return match.group(0)
            
        key = f"text_{counter}"
        translations[key] = text
        counter += 1
        
        # Return with data-i18n attribute
        # We need to wrap it in a span if the parent is not easily modified,
        # but since we are matching between > and <, the best way is to wrap in a span.
        return f'>\n<span data-i18n="{key}">{text}</span>\n<'

    new_content = arabic_pattern.sub(repl, content)

    # Let's also look for placeholders (though the HTML didn't seem to have forms in the provided snippet)
    placeholder_pattern = re.compile(r'placeholder="([^"]+[\u0600-\u06FF]+[^"]*)"')
    def repl_placeholder(match):
        nonlocal counter
        text = match.group(1).strip()
        key = f"placeholder_{counter}"
        translations[key] = text
        counter += 1
        return f'placeholder="{text}" data-i18n-placeholder="{key}"'

    new_content = placeholder_pattern.sub(repl_placeholder, new_content)
    
    with open('index_i18n.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    with open('extracted_texts.json', 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    process_html()
