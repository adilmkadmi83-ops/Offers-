function setLanguage(lang) {
    if (!translations[lang]) return;
    localStorage.setItem('selected_lang', lang);
    
    // ضبط الاتجاه واللغة في الوسم الرئيسي
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // تحديث كافة النصوص
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let val = translations[lang];
        for (let k of keys) {
            if (val) val = val[k];
        }
        if (val) el.innerHTML = val; // Using innerHTML instead of textContent to preserve line breaks and formatting
    });

    // تحديث الـ Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const keys = key.split('.');
        let val = translations[lang];
        for (let k of keys) {
            if (val) val = val[k];
        }
        if (val) el.placeholder = val;
    });

    // تحديث قيمة القائمة المنسدلة
    const switcher = document.getElementById('language-switcher');
    if (switcher) switcher.value = lang;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selected_lang') || 'en';
    setLanguage(savedLang);

    const switcher = document.getElementById('language-switcher');
    if (switcher) {
        switcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
