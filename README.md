# 🛸 Time Police E-Files (RickAndMorty_E-Akte)

![Introduction](/resources/img/timecop_introducing.jpg)     ![Beating up suspect](/resources/img/timecop_beating_einstein.jpg)

> A 4th Dimensional Time Police case-file terminal for browsing the **Rick and Morty** universe, which is built as a web-development project (HTML5, CSS3, JavaScript, jQuery, Chart.js).

Personnel files on every known interdimensional being, displayed on a retro-futuristic HUD terminal: dark void background, neon cyan/magenta accents, scanlines, and a live "MOST WANTED" ticker.

---

## ✨ Features

- **Case-file browser**: scrollable roster of all characters from the [Rick and Morty API](https://rickandmortyapi.com/), with a full personnel file (species, sex, origin, last known location, status) on selection
- **Multi-field search**: filter by **Name**, **File-Nr.**, **Species**, **Sex**, **Origin** or **Last Seen** via a dropdown next to the search field
  - Name search queries the API directly
  - All other fields filter locally against the full ~826-character dataset, since the API itself doesn't support filtering by origin or location
- **Statistics panel**: four radar/spider-web charts breaking down the entire character database by Species, Sex, Origin and Last Seen (top 10 values shown per chart, via [Chart.js](https://www.chartjs.org/))
- **Reference links**: quick links to the Rick and Morty API docs and source
- **"MOST WANTED" ticker**: a scrolling banner across the bottom of the screen
- **jQuery UI tooltip**: on hover for select UI elements
- **Fully responsive layout** (sidebar, case file and stats panel stack on smaller screens)

---

## 🖥️ Tech Stack

| Layer      | Tools |
|------------|-------|
| Markup     | HTML |
| Styling    | CSS (custom properties, Flexbox, media queries) |
| Behaviour  | JavaScript |
| Library    | jQuery |
| Charts     | Chart.js |
| Fonts      | [Orbitron](https://fonts.google.com/specimen/Orbitron) (display) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (body) via Google Fonts |
| Data       | [Rick and Morty API](https://rickandmortyapi.com/) (public, no key required) |

---

## 🚀 Getting Started

Clone the repo and open `index.html` in a browser; no further install.

```bash
git clone https://github.com/<your-username>/time-police-efiles.git
cd time-police-efiles
```

Then either:
- double-click `index.html`, or
- serve it locally 

---

## 📁 Project Structure (Excluding README.md and its pic files)

```
.
├── index.html              # Markup + Google Fonts / CDN script tags
├── css/
│   └── style.css           # All styling (theme, layout, responsive rules)
├── js/
│   ├── api.js               # Rick and Morty API calls (jQuery $.ajax / $.getJSON)
│   └── app.js               # DOM rendering, search, charts, UI wiring
└── resources/
    └── img/
        └── timecopbadge-removebg-preview.png   # Sidebar logo
```

---

## 🌐 Data Source

All character data is fetched live from the free, open [Rick and Morty API](https://rickandmortyapi.com/documentation). No API key or authentication required.

---

## 📄 License

This is a personal project built for practicing web development. Character data and images are provided by the Rick and Morty API and belong to their respective owners (Adult Swim / Rick and Morty).