const fs = require('fs-extra');
const path = require('path');
const nunjucks = require('nunjucks');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const BUILD = path.join(ROOT, 'docs');

// Site-wide data
const site = {
    name: 'CB Účto s.r.o.',
    phone: '+420774803161',
    phoneFormatted: '774 803 161',
    email: 'cbucto@gmail.com',
    address: {
        street: 'U Tří lvů 297/10',
        city: 'České Budějovice',
        zip: '370 01',
    },
    ico: '28067240',
    mapUrl: 'https://mapy.com/s/nabolobohe',
    url: 'https://www.cbucto.cz',
    owner: 'Monika Novotná',
};

const year = new Date().getFullYear();

// Pricing cards data
const pricing = [
    {
        title: 'Daňová evidence',
        subtitle: 'Pro OSVČ a malé firmy',
        price: 'od 1 500 Kč',
        priceSuffix: '/měs',
        icon: '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
        features: ['Zpracování dokladů', 'Přehled příjmů a výdajů', 'DPH hlášení'],
    },
    {
        title: 'Účetnictví (s.r.o.)',
        subtitle: 'Kompletní vedení',
        price: 'od 2 500 Kč',
        priceSuffix: '/měs',
        recommended: true,
        icon: '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
        features: ['Vedení účetnictví', 'DPH, KH, SH', 'Roční závěrka'],
    },
    {
        title: 'Mzdy',
        subtitle: 'Cena za zaměstnance',
        price: 'od 250 Kč',
        priceSuffix: '/osoba',
        icon: '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
        features: ['Výplatní pásky', 'Přihlášky/Odhlášky', 'Komunikace s úřady'],
    },
    {
        title: 'Konzultace',
        subtitle: 'Poradenství a analýzy',
        price: 'První konzultace zdarma',
        priceHighlight: true,
        icon: '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
        features: ['Daňová optimalizace', 'Zahájení podnikání', 'Kontrola účetnictví'],
    },
];

// Blog posts data
const blogPosts = [
    {
        url: 'blog/tipy-pro-zacinajici-podnikatele.html',
        gradient: 'from-fuchsia-200 to-fuchsia-300',
        icon: '<svg class="w-16 h-16 text-fuchsia-600 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>',
        badgeClass: 'bg-fuchsia-100 text-fuchsia-700',
        category: 'Podnikání',
        date: '8. ledna 2025',
        title: '5 tipů pro začínající podnikatele',
        excerpt: 'Praktické rady, jak správně vést účetnictví od samého začátku a vyhnout se nejčastějším chybám.',
    },
    {
        url: 'blog/digitalizace-ucetnictvi.html',
        gradient: 'from-slate-700 to-slate-900',
        icon: '<svg class="w-16 h-16 text-lime-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
        badgeClass: 'bg-slate-100 text-slate-700',
        category: 'Technologie',
        date: '2. ledna 2025',
        title: 'Digitalizace účetnictví: Proč přejít',
        excerpt: 'Zjistěte, jaké výhody přináší digitální účetnictví a jak snadno můžete přejít na elektronickou evidenci.',
    },
];

// Page definitions
const pages = [
    {
        template: 'pages/index.njk',
        output: 'index.html',
        data: {
            title: 'CB Účto s.r.o. | Účetnictví, daně a mzdy České Budějovice',
            description: 'Profesionální účetní služby v Českých Budějovicích. Daňová evidence, mzdy, daňová přiznání a optimalizace. Svoz dokladů zdarma.',
            bodyClass: 'font-sans text-slate-800 bg-gradient-to-b from-fuchsia-100 via-pink-50 to-fuchsia-50 min-h-screen selection:bg-lime-400 selection:text-slate-900 overflow-x-hidden',
            isHome: true,
            basePath: '.',
            canonicalPath: '/',
            pricing,
            blogPosts,
        },
    },
    {
        template: 'pages/blog/tipy-pro-zacinajici-podnikatele.njk',
        output: 'blog/tipy-pro-zacinajici-podnikatele.html',
        data: {
            title: '5 tipů pro začínající podnikatele | CB Účto s.r.o.',
            description: 'Praktické rady pro začínající podnikatele, jak správně vést účetnictví od samého začátku a vyhnout se nejčastějším chybám.',
            bodyClass: 'font-sans text-slate-800 bg-gradient-to-b from-fuchsia-100 via-pink-50 to-fuchsia-50 min-h-screen',
            isHome: false,
            basePath: '..',
            canonicalPath: '/blog/tipy-pro-zacinajici-podnikatele.html',
            breadcrumb: 'Tipy pro začínající podnikatele',
            category: 'Podnikání',
            categoryBadgeClass: 'bg-fuchsia-100 text-fuchsia-700',
            date: '8. ledna 2025',
            dateISO: '2025-01-08',
            articleTitle: '5 tipů pro začínající podnikatele: Jak správně vést účetnictví',
            articleSubtitle: 'Začínáte podnikat a nevíte, jak na účetnictví? Přinášíme vám praktické rady, které vám pomohou vyhnout se nejčastějším chybám a ušetřit peníze i nervy.',
        },
    },
    {
        template: 'pages/blog/digitalizace-ucetnictvi.njk',
        output: 'blog/digitalizace-ucetnictvi.html',
        data: {
            title: 'Digitalizace účetnictví: Výhody a jak začít | CB Účto s.r.o.',
            description: 'Proč přejít na digitální účetnictví? Zjistěte výhody elektronické evidence dokladů a jak snadno digitalizovat vaši firmu.',
            bodyClass: 'font-sans text-slate-800 bg-gradient-to-b from-fuchsia-100 via-pink-50 to-fuchsia-50 min-h-screen',
            isHome: false,
            basePath: '..',
            canonicalPath: '/blog/digitalizace-ucetnictvi.html',
            breadcrumb: 'Digitalizace účetnictví',
            category: 'Technologie',
            categoryBadgeClass: 'bg-slate-100 text-slate-700',
            date: '2. ledna 2025',
            dateISO: '2025-01-02',
            articleTitle: 'Digitalizace účetnictví: Proč přejít a jak na to',
            articleSubtitle: 'Papírové šanony plné faktur jsou minulostí. Zjistěte, jaké výhody přináší digitální účetnictví a jak snadno můžete přejít na elektronickou evidenci dokladů.',
        },
    },
];

async function build() {
    console.log('Building site...');

    // 1. Clean build directory
    await fs.remove(BUILD);
    await fs.ensureDir(BUILD);
    await fs.ensureDir(path.join(BUILD, 'blog'));
    await fs.ensureDir(path.join(BUILD, 'css'));
    await fs.ensureDir(path.join(BUILD, 'fonts'));

    // 2. Copy static assets
    console.log('  Copying assets...');
    const assetsDir = path.join(SRC, 'assets');
    const assetFiles = await fs.readdir(assetsDir);
    for (const file of assetFiles) {
        const src = path.join(assetsDir, file);
        const stat = await fs.stat(src);
        if (stat.isFile()) {
            await fs.copy(src, path.join(BUILD, file));
        }
    }

    // 3. Copy favicon files to build root
    console.log('  Copying favicons...');
    const faviconDir = path.join(SRC, 'assets', 'favicon');
    const faviconFiles = await fs.readdir(faviconDir);
    for (const file of faviconFiles) {
        await fs.copy(path.join(faviconDir, file), path.join(BUILD, file));
    }

    // 4. Copy Inter font files from @fontsource-variable/inter (only latin + latin-ext)
    console.log('  Copying fonts...');
    const fontsourceDir = path.join(ROOT, 'node_modules', '@fontsource-variable', 'inter', 'files');
    const neededFonts = [
        'inter-latin-wght-normal.woff2',
        'inter-latin-ext-wght-normal.woff2',
    ];
    for (const file of neededFonts) {
        await fs.copy(path.join(fontsourceDir, file), path.join(BUILD, 'fonts', file));
    }

    // 5. Process CSS with Tailwind + Autoprefixer
    console.log('  Processing CSS...');
    const cssInput = await fs.readFile(path.join(SRC, 'css', 'main.css'), 'utf8');
    const cssResult = await postcss([
        tailwindcss(path.join(ROOT, 'tailwind.config.js')),
        autoprefixer,
    ]).process(cssInput, {
        from: path.join(SRC, 'css', 'main.css'),
        to: path.join(BUILD, 'css', 'main.css'),
    });
    await fs.writeFile(path.join(BUILD, 'css', 'main.css'), cssResult.css);

    // 6. Render Nunjucks templates
    console.log('  Rendering pages...');
    const env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(SRC, { noCache: true }),
        { autoescape: false }
    );

    const commonData = { site, year };

    for (const page of pages) {
        const data = { ...commonData, ...page.data };
        const html = env.render(page.template, data);
        const outputPath = path.join(BUILD, page.output);
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, html);
        console.log(`    ${page.output}`);
    }

    // 7. Generate sitemap.xml
    console.log('  Generating sitemap...');
    const sitemapUrls = pages.map(page => {
        const loc = `${site.url}/${page.output}`;
        const lastmod = new Date().toISOString().split('T')[0];
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`;
    await fs.writeFile(path.join(BUILD, 'sitemap.xml'), sitemap);

    console.log('Build complete!');
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
