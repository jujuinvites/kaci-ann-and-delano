import React, { useState, useEffect, useMemo } from 'react';

/* =============================================================
   GLOBAL KEYFRAMES (injected once)
   ============================================================= */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.93); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes floatY {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-10px); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(32px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      /* Dark base */
      body { background: #0a0f18; }

      /* Press feedback — every clickable element */
      button:active, a:active {
        transform: scale(0.96) !important;
        transition: transform 100ms cubic-bezier(0.23,1,0.32,1) !important;
      }

      /* Input dark styling */
      input::placeholder { color: rgba(138,164,184,0.6); }
      input { color-scheme: dark; }

      /* Hover effects only on devices that support hover */
      @media (hover: hover) and (pointer: fine) {
        .explore-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 14px 32px rgba(80,110,140,0.18);
        }
        .soft-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(80,110,140,0.16);
        }
        .love-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(107,143,168,0.14);
        }
        .nav-menu-item:hover {
          background: rgba(107,143,168,0.05) !important;
        }
      }
    `}</style>
  );
}

/* Wraps page content — re-mounts on navigation to replay animation */
const FadeInPage = ({ children, style }) => (
  <div style={{ animation: 'fadeInUp 0.38s cubic-bezier(0.22,1,0.36,1) both', ...style }}>
    {children}
  </div>
);

/* =============================================================
   THEME
   ============================================================= */
const theme = {
  dustyBlue: '#a8c8dc',
  cream: '#0a0f18',
  beigeBg: '#0d1520',
  pageBg: '#0a0f18',
  cardBg: 'rgba(255,255,255,0.06)',
  cardShadow: '0 4px 24px rgba(0,0,0,0.5)',
  text: '#dce8f2',
  textSoft: '#8aa4b8',
  divider: 'rgba(168,200,220,0.12)',

  fonts: {
    script: "'Great Vibes', cursive",
    title: "'Playfair Display', serif",
    body: "'Raleway', sans-serif"
  },

  images: {
    logoImage: '/images/logo.png',
    namesImage: '/images/names.png',
    flowersImage: '/images/flowers.png',
    coupleBannerImage: '/images/couple-banner.png',
    bigFlowersImage: '/images/big-flowers.png',
    blueFlowerImage: '/images/blue-flower.png',
    waxSealImage: '/images/wax-seal.png',
  }
};

/* =============================================================
   DEFAULT CONTENT
   ============================================================= */
const DEFAULT_CONTENT = {
  couple: 'Kaci-Ann & Delano',
  date: 'Saturday, July 4, 2026',
  venueLine1: 'Little Savoy Guest House',
  venueLine2: 'Runaway Bay, St. Ann, Jamaica',
  welcomeMessage:
    'We are so grateful you are here to share in our love story. Welcome to a day made for celebrating, dancing, and quiet moments shared with those who matter most.',

  menu: [
    {
      section: 'Appetizer',
      items: ['Chicken Soup w/ Dinner Rolls']
    },
    {
      section: 'Main Course',
      items: ['Escoveitch Fish', 'Baked Chicken', 'Stew Pork']
    },
    {
      section: 'Carbohydrates',
      items: ['Rice & Peas']
    },
    {
      section: 'Sides',
      items: ['Baked Mac & Cheese', 'Mashed Potatoes', 'Steam Veg']
    },
    {
      section: 'Drinks',
      items: ['Fruit Punch', 'Pineapple Ginger Juice', 'Champagne', 'Water']
    },
    {
      section: 'Cocktail Hour',
      items: ['Water', 'Juice', 'Soup']
    }
  ],
  menuNote: 'Buffet Service — Please help yourself as your table is invited',

  timeline: [
    { time: '1:30 PM', title: 'Guest Arrival', detail: '' },
    { time: '2:00 PM', title: 'Ceremony Begins', detail: '' },
    { time: '3:00 PM', title: 'Cocktail Hour', detail: '' },
    { time: '5:00 PM', title: 'Reception', detail: '' },
    { time: '9:00 PM', title: 'Send Off', detail: '' }
  ]
};

const DEFAULT_BRIDAL = {
  roles: [
    { role: 'Matron of Honour', names: ['Mrs. Kendra Simpson'] },
    { role: 'Bridesmaid', names: ["Ms. K'Fian Russell"] },
    { role: 'Best Man', names: ['Mr. Alex Russell'] },
    { role: 'Groomsman', names: ['Mr. Jamoy Anguin'] },
    { role: 'Officiant', names: ['Bishop Vernon Morrison'] },
    { role: 'Flower Girls', names: ["Khalian Russell", "K'Drian Russell"] },
    { role: 'Ring Bearer', names: ['Mykal Russell'] },
    { role: 'Scripture Readers', names: ['Mr. Adrian Huntley', 'Ms. Shelian Samuels'] }
  ]
};

const DEFAULT_KEY_FAMILY = [
  {
    group: 'Ceremony',
    members: [
      { role: 'Officiant', names: ['Bishop Vernon Morrison'] },
      { role: 'Invocation', names: ['Rev. Deloris Trowers'] },
      { role: 'Scripture Readers', names: ['Mr. Adrian Huntley', 'Ms. Shelian Samuels'] },
      { role: 'Ministry of Song', names: ['Sis. Shanique Davis'] },
    ]
  },
  {
    group: 'Reception',
    members: [
      { role: 'Director of Programme', names: ["Bishop Marlon O'Leslie"] },
      { role: 'Blessing of Meal & Cake', names: ['Sis. Mavis Bailey'] },
    ]
  }
];

const CEREMONY_PROGRAMME = [
  { item: 'Processional' },
  { item: 'Musical Prelude' },
  { item: 'Seating of Family & Guests' },
  { item: 'Entrance', detail: "Groom's Parents · Grandparents of the Couple · Bridal Party · Ring Bearer · Flower Girls" },
  { item: "Bride's Entrance" },
  { item: 'Opening Song' },
  { item: 'Officiant', participant: 'Bishop Vernon Morrison' },
  { item: 'Invocation', participant: 'Rev. Deloris Trowers' },
  { item: 'Welcome' },
  { item: 'Scripture Readings', participant: 'Mr. Adrian Huntley & Ms. Shelian Samuels' },
  { item: 'Officiant Address to Couple' },
  { item: 'Exchange of Vows & Rings' },
  { item: 'Signing of Registry', detail: 'Ministry of Song', participant: 'Sis. Shanique Davis' },
  { item: 'Unity Ceremony', detail: 'Sand Ceremony' },
  { item: 'Blessings & Prayer for Couple' },
  { item: 'Pronouncement' },
  { item: 'Recessional' },
];

const COCKTAIL_PROGRAMME = [
  { item: 'Refreshments — Water, Juice & Soup' },
  { item: 'Dominoes' },
  { item: 'Jumbo Jenga' },
  { item: 'DJ Entertainment' },
  { item: 'Wedding Mirror' },
];

const RECEPTION_PROGRAMME = [
  { item: 'Director of Programme', participant: "Bishop Marlon O'Leslie" },
  { item: 'Invitation to Dinner' },
  { item: 'Seating of Guests' },
  { item: 'Bridal Party Entrance' },
  { item: 'Newly Wed Entrance' },
  { item: 'First Dance', detail: 'Newly Weds' },
  { item: 'Blessing of Meal & Cake', participant: 'Sis. Mavis Bailey' },
  { item: 'Serving of Dishes' },
  { item: 'Toast & Speeches' },
  { item: 'Unveiling of Cake', detail: 'Mothers of the Couple' },
  { item: 'Cutting & Feeding of Cake' },
  { item: 'Games', detail: 'Shoe Couples · Removing of Garter · Tossing of Bouquet & Garter' },
  { item: 'Dessert & Wedding Favour Handouts' },
  { item: 'Send Off' },
];

const DEFAULT_GUESTS = [
  { name: 'Jane Doe', table: '1', seat: '1', group: 'Family' },
  { name: 'John Doe', table: '1', seat: '2', group: 'Family' },
  { name: 'Marcus Reid', table: '2', seat: '1', group: 'Groomsmen' },
  { name: 'Alicia Brown', table: '2', seat: '2', group: 'Bridesmaids' },
  { name: 'Pastor R. Bennett', table: '3', seat: '1', group: 'Officiant' }
];

const GUEST_NOTES_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzDXAv08SbrOdZxAZVOq6g7LiwLE4Bacp5k0bW_0vrY_RLECiFjH9cr7fEegIIWZDPsmQ/exec';
const GUESTS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11YkKUVhGwRb_ivQomiakuLo-ItrthgavSfsoMQQEHJk/gviz/tq?tqx=out:csv';

function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

async function fetchGuestsFromSheet() {
  try {
    const res = await fetch(`${GUESTS_SHEET_URL}&t=${Date.now()}`);
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return null;
    const headers = splitCSVLine(lines[0]).map(h => h.toLowerCase());
    const ni = headers.indexOf('name');
    const ti = headers.indexOf('table');
    const si = headers.indexOf('seat');
    const gi = headers.indexOf('group');
    const rows = lines.slice(1).map(line => {
      const c = splitCSVLine(line);
      return { name: c[ni] || '', table: c[ti] || '', seat: c[si] || '', group: c[gi] || '' };
    }).filter(g => g.name);
    return rows.length ? rows : null;
  } catch {
    return null;
  }
}

/* =============================================================
   localStorage helpers
   ============================================================= */
const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }
};

/* =============================================================
   Reusable primitives
   ============================================================= */
const Section = ({ children, style }) => (
  <section style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px', ...style }}>
    {children}
  </section>
);

const SectionHeader = ({ overline, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: 40 }}>
    {overline && (
      <div style={{
        fontFamily: theme.fonts.body,
        fontSize: 14,
        letterSpacing: 4,
        textTransform: 'uppercase',
        color: theme.dustyBlue,
        marginBottom: 12,
        animation: 'fadeIn 0.6s ease both',
        animationDelay: '0.05s'
      }}>
        {overline}
      </div>
    )}
    <h2 style={{
      fontFamily: theme.fonts.script,
      fontSize: 'clamp(44px, 9vw, 68px)',
      fontWeight: 400,
      color: theme.dustyBlue,
      margin: 0,
      lineHeight: 1.15,
      animation: 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) both',
      animationDelay: '0.12s'
    }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{
        fontFamily: theme.fonts.body,
        fontSize: 15,
        color: theme.textSoft,
        marginTop: 14,
        lineHeight: 1.6,
        animation: 'fadeIn 0.6s ease both',
        animationDelay: '0.25s'
      }}>
        {subtitle}
      </p>
    )}
  </div>
);

const SoftCard = ({ children, style, onClick, onMouseEnter, onMouseLeave, className }) => (
  <div
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={className}
    style={{
      background: theme.cardBg,
      borderRadius: 18,
      boxShadow: theme.cardShadow,
      padding: 24,
      transition: 'transform 220ms cubic-bezier(0.23,1,0.32,1), box-shadow 220ms ease-out',
      ...style
    }}
  >
    {children}
  </div>
);

const BackLink = ({ onBack }) => (
  <button
    onClick={onBack}
    style={{
      background: 'transparent',
      border: `1px solid rgba(168,200,220,0.25)`,
      borderRadius: 999,
      color: theme.dustyBlue,
      fontFamily: theme.fonts.body,
      fontSize: 11,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 18,
      padding: '8px 20px',
      cursor: 'pointer',
      animation: 'fadeIn 0.4s ease both',
      transition: 'border-color 200ms ease-out, color 200ms ease-out'
    }}
  >
    ← Back
  </button>
);

/* =============================================================
   HEADER / NAV
   ============================================================= */
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'timeline', label: 'Wedding Timeline' },
  { id: 'ceremony', label: 'Ceremony Programme' },
  { id: 'bridal', label: 'Bridal Party' },
  { id: 'family', label: 'Key Family Members & Participants' },
  { id: 'seating', label: 'Seating Plan' },
  { id: 'reception', label: 'Reception Programme' },
  { id: 'menu', label: 'Menu' },
  { id: 'love', label: 'Love & Wisdom' },
];

function Header({ onNavigate, current }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => { onNavigate(id); setMenuOpen(false); };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        background: 'rgba(8,12,20,0.92)',
        borderBottom: `1px solid ${theme.divider}`,
        transition: 'box-shadow 200ms ease-out'
      }}>
        <div style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '10px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => handleNav('home')}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img
              src={theme.images.logoImage}
              alt="K & D"
              style={{ height: 52, width: 52, objectFit: 'contain', transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 5
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: i === 1 ? 18 : 26,
                height: 2,
                background: theme.text,
                borderRadius: 2,
                transition: 'width 250ms ease'
              }} />
            ))}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ flex: 1, background: 'rgba(0,0,0,0.35)', animation: 'fadeIn 0.25s ease both' }}
          />
          <div style={{
            width: 300,
            background: '#0d1520',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: `1px solid ${theme.divider}`
            }}>
              <img
                src={theme.images.logoImage}
                alt="K & D"
                style={{ height: 44, width: 44, objectFit: 'contain' }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 28,
                  color: theme.text,
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: 4
                }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, paddingTop: 8 }}>
              {NAV_ITEMS.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: current === item.id ? 'rgba(107,143,168,0.07)' : 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${theme.divider}`,
                    padding: '18px 28px',
                    fontFamily: theme.fonts.body,
                    fontSize: 16,
                    color: current === item.id ? theme.dustyBlue : theme.text,
                    cursor: 'pointer',
                    transition: 'background 200ms ease, color 200ms ease',
                    animation: `fadeInUp 0.35s ease both`,
                    animationDelay: `${i * 0.04}s`
                  }}
                  className={`nav-menu-item${current === item.id ? ' active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =============================================================
   FOOTER
   ============================================================= */
function Footer() {
  return (
    <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0 }}>
      <img
        src={theme.images.coupleBannerImage}
        alt="Kaci-Ann & Delano"
        style={{ width: '100%', display: 'block', objectFit: 'cover', minHeight: 180 }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}

/* =============================================================
   HERO
   ============================================================= */
function Hero({ content }) {
  return (
    <div style={{
      background: 'linear-gradient(to bottom, #050810 0%, #080e18 60%, #0a1020 100%)',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '72px 24px 48px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: theme.dustyBlue,
          marginBottom: 36,
          animation: 'fadeInUp 0.6s ease both',
          animationDelay: '0.1s'
        }}>
          Welcome to the wedding of
        </div>

        <img
          src={theme.images.namesImage}
          alt="Kaci-Ann & Delano"
          style={{
            width: '88%',
            maxWidth: 560,
            display: 'block',
            margin: '0 auto 40px',
            animation: 'fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.25s'
          }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          marginBottom: 22,
          animation: 'fadeIn 0.8s ease both',
          animationDelay: '0.5s'
        }}>
          <div style={{ height: 1, width: 56, background: theme.divider }} />
          <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
            <circle cx="11" cy="9" r="7" stroke={theme.dustyBlue} strokeWidth="1.5" fill="none" />
            <circle cx="21" cy="9" r="7" stroke={theme.dustyBlue} strokeWidth="1.5" fill="none" />
          </svg>
          <div style={{ height: 1, width: 56, background: theme.divider }} />
        </div>

        <div style={{
          fontFamily: theme.fonts.title,
          fontSize: 'clamp(20px, 3vw, 26px)',
          fontWeight: 700,
          color: theme.text,
          letterSpacing: 1,
          marginBottom: 10,
          animation: 'fadeInUp 0.6s ease both',
          animationDelay: '0.6s'
        }}>
          {content.date}
        </div>

        <div style={{
          fontFamily: theme.fonts.title,
          fontSize: 17,
          fontStyle: 'italic',
          color: theme.textSoft,
          marginBottom: 28,
          animation: 'fadeInUp 0.6s ease both',
          animationDelay: '0.7s'
        }}>
          {content.venueLine1}
        </div>

        <p style={{
          fontFamily: theme.fonts.body,
          fontSize: 16,
          color: theme.textSoft,
          lineHeight: 1.8,
          maxWidth: 480,
          margin: '0 auto',
          animation: 'fadeInUp 0.6s ease both',
          animationDelay: '0.85s'
        }}>
          {content.welcomeMessage}
        </p>
      </div>

      <img
        src={theme.images.bigFlowersImage}
        alt=""
        aria-hidden
        style={{
          width: '100%',
          display: 'block',
          animation: 'fadeIn 1.2s ease both',
          animationDelay: '0.4s'
        }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}

/* =============================================================
   FIND YOUR SEAT
   ============================================================= */
function FindYourSeat({ guests }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setSearched(false);
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const match = guests.find(g => (g.name || '').toLowerCase().includes(q));
      setResult(match || null);
      setLoading(false);
      setSearched(true);
    }, 450);
  };

  return (
    <Section style={{ paddingTop: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 style={{
          fontFamily: theme.fonts.script,
          fontSize: 'clamp(36px, 6vw, 52px)',
          fontWeight: 400,
          color: theme.text,
          margin: '0 0 8px'
        }}>
          Find Your Seat
        </h2>
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: 11,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: theme.dustyBlue
        }}>
          Search by your name below
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: 10,
          maxWidth: 520,
          margin: '0 auto',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Your name"
          style={{
            flex: '1 1 220px',
            minWidth: 220,
            padding: '14px 20px',
            borderRadius: 999,
            border: `1px solid rgba(168,200,220,0.2)`,
            background: 'rgba(255,255,255,0.06)',
            fontSize: 15,
            outline: 'none',
            color: theme.text,
            boxShadow: 'none',
            transition: 'box-shadow 200ms ease, border-color 200ms ease'
          }}
          onFocus={e => { e.currentTarget.style.borderColor = theme.dustyBlue; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168,200,220,0.15)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(168,200,220,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
        <button
          type="submit"
          style={{
            padding: '14px 28px',
            borderRadius: 999,
            border: 'none',
            background: theme.dustyBlue,
            color: '#fff',
            fontSize: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'transform 200ms ease, box-shadow 200ms ease',
            boxShadow: '0 4px 14px rgba(107,143,168,0.30)'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(107,143,168,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(107,143,168,0.30)'; }}
        >
          Find My Seat
        </button>
      </form>

      <div style={{ marginTop: 28, minHeight: 80, textAlign: 'center' }}>
        {loading && (
          <div style={{ fontFamily: theme.fonts.body, color: theme.textSoft, animation: 'fadeIn 0.3s ease both' }}>
            Searching…
          </div>
        )}

        {!loading && searched && result && (
          <SoftCard style={{
            maxWidth: 420,
            margin: '0 auto',
            textAlign: 'center',
            background: 'rgba(168,200,220,0.08)',
            border: `1px solid rgba(168,200,220,0.18)`,
            animation: 'scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both'
          }}>
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 11,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: theme.dustyBlue,
              marginBottom: 8
            }}>
              You're seated here
            </div>
            <div style={{ fontFamily: theme.fonts.title, fontSize: 24, color: theme.text }}>
              {result.name}
            </div>
            <div style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'center',
              gap: 28,
              fontFamily: theme.fonts.body,
              fontSize: 14,
              color: theme.textSoft
            }}>
              {[
                { label: 'Table', value: result.table || '—', big: true },
                { label: 'Seat', value: result.seat || '—', big: true },
                { label: 'Group', value: result.group || '—', big: false }
              ].map(({ label, value, big }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: big ? 22 : 14, color: theme.text, marginTop: 4 }}>{value}</div>
                </div>
              ))}
            </div>
          </SoftCard>
        )}

        {!loading && searched && !result && (
          <div style={{
            fontFamily: theme.fonts.body,
            color: theme.textSoft,
            animation: 'fadeIn 0.4s ease both'
          }}>
            We couldn't find that name — please try a different spelling, or ask a host.
          </div>
        )}
      </div>
    </Section>
  );
}

/* =============================================================
   EXPLORE GRID
   ============================================================= */
const EXPLORE_CARDS = [
  {
    id: 'timeline', title: 'Wedding Timeline',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
  },
  {
    id: 'ceremony', title: 'Ceremony Programme',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
  {
    id: 'bridal', title: 'Bridal Party',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  {
    id: 'family', title: 'Key Family & Participants',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  },
  {
    id: 'seating', title: 'Seating Plan',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
  },
  {
    id: 'reception', title: 'Reception Programme',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  },
  {
    id: 'menu', title: 'Menu',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
  },
  {
    id: 'love', title: 'Love & Wisdom',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>
  },
];

function ExploreGrid({ onNavigate }) {
  return (
    <div style={{ padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{
          fontFamily: theme.fonts.script,
          fontSize: 'clamp(36px, 6vw, 52px)',
          fontWeight: 400,
          color: theme.text,
          margin: '0 0 8px'
        }}>
          Explore the Day
        </h2>
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: 11,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: theme.dustyBlue
        }}>
          Tap to navigate
        </div>
      </div>

      <div style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        maxWidth: 880,
        margin: '0 auto'
      }}>
        {EXPLORE_CARDS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onNavigate(c.id)}
            className="explore-card"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid rgba(168,200,220,0.12)`,
              borderRadius: 18,
              boxShadow: theme.cardShadow,
              padding: '32px 20px',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms ease-out',
              animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.05 + i * 0.07}s`
            }}
          >
            <span style={{
              color: theme.dustyBlue,
              transition: 'transform 300ms ease',
              display: 'block'
            }}>
              {c.icon}
            </span>
            <span style={{
              fontFamily: theme.fonts.body,
              fontSize: 16,
              color: theme.text,
              fontWeight: 400
            }}>
              {c.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =============================================================
   PAGE: TIMELINE
   ============================================================= */
function TimelinePage({ content, onBack }) {
  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader overline="The day at a glance" title="Timeline" />
      <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative', paddingLeft: 28 }}>
        <div style={{
          position: 'absolute',
          left: 9,
          top: 6,
          bottom: 6,
          width: 1,
          background: theme.divider
        }} />
        {content.timeline.map((t, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              padding: '14px 0 26px',
              animation: 'fadeInUp 0.5s ease both',
              animationDelay: `${0.15 + i * 0.09}s`
            }}
          >
            <div style={{
              position: 'absolute',
              left: -28,
              top: 22,
              width: 10,
              height: 10,
              borderRadius: 999,
              background: theme.dustyBlue,
              boxShadow: '0 0 0 3px rgba(107,143,168,0.18)'
            }} />
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: theme.dustyBlue,
              marginBottom: 6
            }}>
              {t.time}
            </div>
            <div style={{ fontFamily: theme.fonts.title, fontSize: 22, color: theme.text }}>
              {t.title}
            </div>
            {t.detail && (
              <div style={{
                fontFamily: theme.fonts.body,
                fontSize: 14,
                color: theme.textSoft,
                marginTop: 6,
                lineHeight: 1.7
              }}>
                {t.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* =============================================================
   PAGE: MENU
   ============================================================= */
function MenuPage({ content, onBack }) {
  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader overline="Tonight's Table" title="Menu" />
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        {content.menu.map((sec, i) => (
          <div
            key={i}
            style={{
              marginBottom: 44,
              animation: 'fadeInUp 0.55s ease both',
              animationDelay: `${0.2 + i * 0.12}s`
            }}
          >
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: theme.dustyBlue,
              marginBottom: 10
            }}>
              {sec.section}
            </div>
            <div style={{ width: 32, height: 1, margin: '0 auto 18px', background: theme.divider }} />
            {sec.items.map((it, j) => (
              <div key={j} style={{
                fontFamily: theme.fonts.title,
                fontSize: 20,
                color: theme.text,
                margin: '8px 0',
                lineHeight: 1.6
              }}>
                {it}
              </div>
            ))}
          </div>
        ))}
        {content.menuNote && (
          <div style={{
            marginTop: 16,
            paddingTop: 28,
            borderTop: `1px solid ${theme.divider}`,
            fontFamily: theme.fonts.body,
            fontSize: 14,
            fontStyle: 'italic',
            color: theme.textSoft,
            lineHeight: 1.7,
            animation: 'fadeIn 0.6s ease both',
            animationDelay: '0.5s'
          }}>
            {content.menuNote}
          </div>
        )}
      </div>
    </Section>
  );
}

/* =============================================================
   PAGE: LOVE & WISDOM
   ============================================================= */
function LoveWisdomPage({ onBack }) {
  const activities = [
    { title: 'Song Dedication', body: 'Identify a love song played by the DJ and either sing a short line or name the artist.' },
    { title: 'Marriage Advice', body: 'Work together to share your best piece of advice for a happy and lasting marriage.' },
    { title: 'Memory Lane', body: 'Share a favourite memory you have with the bride or groom.' }
  ];

  const intro = 'While waiting to be served, each table is invited to take part in a fun and meaningful challenge.';

  return (
    <div style={{
      background: 'linear-gradient(175deg, #080e18 0%, #0d1520 55%, #0a1018 100%)',
      minHeight: '100vh',
      paddingBottom: 72
    }}>
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '48px 24px 0' }}>
        <BackLink onBack={onBack} />

        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24, animation: 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) both', animationDelay: '0.05s' }}>
          <h1 style={{
            fontFamily: theme.fonts.script,
            fontSize: 'clamp(52px, 11vw, 76px)',
            fontWeight: 400,
            color: theme.dustyBlue,
            margin: 0,
            lineHeight: 1.15
          }}>
            Love &amp; Wisdom
          </h1>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 32,
          animation: 'fadeIn 0.8s ease both',
          animationDelay: '0.2s'
        }}>
          <div style={{ flex: 1, maxWidth: 90, height: 1, background: 'rgba(107,143,168,0.35)' }} />
          <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
            <circle cx="11" cy="10" r="8" stroke={theme.dustyBlue} strokeWidth="1.2" fill="none" opacity="0.55" />
            <circle cx="23" cy="10" r="8" stroke={theme.dustyBlue} strokeWidth="1.2" fill="none" opacity="0.55" />
          </svg>
          <div style={{ flex: 1, maxWidth: 90, height: 1, background: 'rgba(107,143,168,0.35)' }} />
        </div>

        <p style={{
          fontFamily: theme.fonts.body,
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: theme.dustyBlue,
          lineHeight: 2,
          textAlign: 'center',
          margin: '0 auto 40px',
          maxWidth: 460,
          animation: 'fadeIn 0.7s ease both',
          animationDelay: '0.3s'
        }}>
          {intro}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activities.map((activity, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(168,200,220,0.07)',
                border: `1px solid rgba(168,200,220,0.12)`,
                borderRadius: 20,
                padding: '22px 24px',
                boxShadow: '0 2px 18px rgba(107,143,168,0.07)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 18,
                animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay: `${0.35 + i * 0.1}s`,
                transition: 'transform 250ms cubic-bezier(0.23,1,0.32,1), box-shadow 250ms ease-out'
              }}
              className="love-card"
            >
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `1.5px solid ${theme.dustyBlue}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: theme.fonts.body,
                fontSize: 13,
                color: theme.dustyBlue,
                opacity: 0.85,
                marginTop: 3
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: theme.fonts.title,
                  fontSize: 19,
                  fontWeight: 500,
                  color: theme.text,
                  marginBottom: 8,
                  letterSpacing: 0.3
                }}>
                  {activity.title}
                </div>
                <div style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 14,
                  color: theme.textSoft,
                  lineHeight: 1.75
                }}>
                  {activity.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   PAGE: BRIDAL PARTY
   ============================================================= */
function BridalPartyPage({ bridal, onBack }) {
  const roles = bridal.roles || [];
  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader overline="By Our Side" title="Bridal Party" />
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {roles.map((item, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              padding: '32px 0',
              borderBottom: i < roles.length - 1 ? `1px solid ${theme.divider}` : 'none',
              animation: 'fadeInUp 0.5s ease both',
              animationDelay: `${0.1 + i * 0.09}s`
            }}
          >
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: theme.dustyBlue,
              marginBottom: 14
            }}>
              {item.role}
            </div>
            {(item.names || []).map((name, j) => (
              <div key={j} style={{
                fontFamily: theme.fonts.title,
                fontSize: 'clamp(20px, 4vw, 26px)',
                fontWeight: 400,
                color: theme.text,
                lineHeight: 1.5
              }}>
                {name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* =============================================================
   PROGRAMME SHARED COMPONENTS
   ============================================================= */
const ProgrammeSectionHeader = ({ overline, title }) => (
  <div style={{
    background: 'linear-gradient(135deg, #4e7a96 0%, #6b8fa8 55%, #8ab0c8 100%)',
    borderRadius: 20,
    padding: '36px 28px 30px',
    textAlign: 'center',
    marginBottom: 20,
    boxShadow: '0 8px 36px rgba(80,110,140,0.22)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.09), transparent)',
      borderRadius: '20px 20px 0 0', pointerEvents: 'none'
    }}/>
    {overline && (
      <div style={{
        fontFamily: theme.fonts.body, fontSize: 11,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)', marginBottom: 10, position: 'relative'
      }}>
        {overline}
      </div>
    )}
    <div style={{
      fontFamily: theme.fonts.script,
      fontSize: 'clamp(52px, 11vw, 72px)',
      color: '#fff', lineHeight: 1.1, position: 'relative'
    }}>
      {title}
    </div>
    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', position: 'relative' }}>
      <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
        <circle cx="15" cy="13" r="10" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"/>
        <circle cx="29" cy="13" r="10" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2"/>
      </svg>
    </div>
  </div>
);

const ProgrammeItemRow = ({ item, index, delay }) => (
  <div style={{
    display: 'flex', gap: 14,
    padding: '16px 18px', marginBottom: 8,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(168,200,220,0.1)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    animation: 'fadeInUp 0.45s ease both',
    animationDelay: `${delay}s`
  }}>
    <div style={{
      width: 26, height: 26, flexShrink: 0,
      borderRadius: '50%',
      border: `1px solid rgba(107,143,168,0.4)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: theme.fonts.body, fontSize: 11, color: theme.dustyBlue,
      marginTop: 1
    }}>
      {index + 1}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: theme.fonts.body, fontSize: 15,
        color: theme.text, fontWeight: 500,
        letterSpacing: 0.2, lineHeight: 1.4
      }}>
        {item.item}
      </div>
      {item.detail && (
        <div style={{
          fontFamily: theme.fonts.body, fontSize: 13,
          color: theme.textSoft, fontStyle: 'italic',
          marginTop: 3, lineHeight: 1.5
        }}>
          {item.detail}
        </div>
      )}
      {item.participant && (
        <div style={{
          fontFamily: theme.fonts.script, fontSize: 22,
          color: theme.dustyBlue, marginTop: 2, lineHeight: 1.2
        }}>
          {item.participant}
        </div>
      )}
    </div>
  </div>
);

/* =============================================================
   PAGE: CEREMONY PROGRAMME
   ============================================================= */
function CeremonyProgrammePage({ onBack }) {
  return (
    <div style={{
      background: 'linear-gradient(160deg, #080e18 0%, #0d1520 55%, #0a1018 100%)',
      minHeight: '100vh', paddingBottom: 72
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px 0' }}>
        <BackLink onBack={onBack} />
        <div style={{ marginTop: 16 }}>
          <ProgrammeSectionHeader overline="Order of Service" title="Ceremony" />
          {CEREMONY_PROGRAMME.map((item, i) => (
            <ProgrammeItemRow key={i} item={item} index={i} delay={0.05 + i * 0.035} />
          ))}

          <div style={{ marginTop: 32 }}>
            <ProgrammeSectionHeader overline="Following the Ceremony" title="Cocktail Hour" />
            {COCKTAIL_PROGRAMME.map((item, i) => (
              <ProgrammeItemRow key={i} item={item} index={i} delay={0.05 + i * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   PAGE: RECEPTION PROGRAMME
   ============================================================= */
function ReceptionProgrammePage({ onBack }) {
  return (
    <div style={{
      background: 'linear-gradient(160deg, #080e18 0%, #0d1520 55%, #0a1018 100%)',
      minHeight: '100vh', paddingBottom: 72
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px 0' }}>
        <BackLink onBack={onBack} />
        <div style={{ marginTop: 16 }}>
          <ProgrammeSectionHeader overline="Evening Celebration" title="Reception" />
          {RECEPTION_PROGRAMME.map((item, i) => (
            <ProgrammeItemRow key={i} item={item} index={i} delay={0.05 + i * 0.04} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   PAGE: KEY FAMILY MEMBERS & PARTICIPANTS
   ============================================================= */
function KeyFamilyPage({ onBack }) {
  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader overline="With Gratitude" title="Key Participants" />
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {DEFAULT_KEY_FAMILY.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 52 }}>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 11,
              letterSpacing: 4, textTransform: 'uppercase',
              color: theme.dustyBlue, textAlign: 'center',
              paddingBottom: 14, marginBottom: 24,
              borderBottom: `1px solid ${theme.divider}`
            }}>
              {group.group}
            </div>
            {group.members.map((member, mi) => (
              <div key={mi} style={{
                textAlign: 'center', padding: '28px 0',
                borderBottom: mi < group.members.length - 1 ? `1px solid ${theme.divider}` : 'none',
                animation: 'fadeInUp 0.5s ease both',
                animationDelay: `${0.1 + (gi * 4 + mi) * 0.08}s`
              }}>
                <div style={{
                  fontFamily: theme.fonts.body, fontSize: 11,
                  fontWeight: 700, letterSpacing: 3,
                  textTransform: 'uppercase', color: theme.dustyBlue,
                  marginBottom: 12
                }}>
                  {member.role}
                </div>
                {member.names.map((name, ni) => (
                  <div key={ni} style={{
                    fontFamily: theme.fonts.title,
                    fontSize: 'clamp(18px, 3.5vw, 24px)',
                    fontWeight: 400, color: theme.text, lineHeight: 1.6
                  }}>
                    {name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* =============================================================
   PAGE: SEATING PLAN
   ============================================================= */
function SeatingPlanPage({ guests, onBack }) {
  const grouped = useMemo(() => {
    const map = {};
    guests.forEach(g => {
      const t = g.table || 'Unassigned';
      if (!map[t]) map[t] = [];
      map[t].push(g);
    });
    const ordered = Object.entries(map).sort((a, b) => {
      const an = parseInt(a[0], 10);
      const bn = parseInt(b[0], 10);
      if (!isNaN(an) && !isNaN(bn)) return an - bn;
      return a[0].localeCompare(b[0]);
    });
    ordered.forEach(([, list]) =>
      list.sort((a, b) => {
        const ax = parseInt(a.seat, 10);
        const bx = parseInt(b.seat, 10);
        if (!isNaN(ax) && !isNaN(bx)) return ax - bx;
        return (a.name || '').localeCompare(b.name || '');
      })
    );
    return ordered;
  }, [guests]);

  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader overline="Seating" title="Seating Plan" />
      <div style={{
        display: 'grid',
        gap: 18,
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
      }}>
        {grouped.map(([table, list], i) => (
          <SoftCard
            key={table}
            className="soft-card-hover"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid rgba(168,200,220,0.12)`,
              animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.1 + i * 0.07}s`,
              transition: 'transform 240ms cubic-bezier(0.23,1,0.32,1), box-shadow 240ms ease-out'
            }}
          >
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 11,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: theme.dustyBlue,
              marginBottom: 4
            }}>
              Table
            </div>
            <div style={{ fontFamily: theme.fonts.title, fontSize: 28, color: theme.text, marginBottom: 14 }}>
              {table}
            </div>
            <div style={{ height: 1, background: theme.divider, margin: '0 0 14px' }} />
            {list.map((g, j) => (
              <div key={j} style={{
                fontFamily: theme.fonts.body,
                fontSize: 14,
                color: theme.text,
                padding: '6px 0',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{g.name}</span>
                {g.seat && <span style={{ color: theme.textSoft, fontSize: 12 }}>seat {g.seat}</span>}
              </div>
            ))}
          </SoftCard>
        ))}
      </div>
    </Section>
  );
}

/* =============================================================
   APP ROOT
   ============================================================= */
export default function App() {
  const [page, setPage] = useState('home');

  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [bridal] = useState(DEFAULT_BRIDAL);
  const [content] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    fetchGuestsFromSheet().then(data => {
      if (data && data.length > 0) setGuests(data);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const bg = page === 'home'
    ? theme.pageBg
    : 'linear-gradient(160deg, #080e18 0%, #0d1520 55%, #0a1018 100%)';

  const goHome = () => setPage('home');

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <GlobalStyles />
      <Header onNavigate={setPage} current={page} />

      <FadeInPage key={page}>
        {page === 'home' && (
          <>
            <Hero content={content} />
            <div style={{ background: 'linear-gradient(180deg, #0a1020 0%, #0d1525 100%)' }}>
              <FindYourSeat guests={guests} />
            </div>
            <div style={{ background: 'linear-gradient(180deg, #0d1525 0%, #0a1020 100%)' }}>
              <ExploreGrid onNavigate={setPage} />
            </div>
          </>
        )}

        {page === 'timeline' && <TimelinePage content={content} onBack={goHome} />}
        {page === 'ceremony' && <CeremonyProgrammePage onBack={goHome} />}
        {page === 'reception' && <ReceptionProgrammePage onBack={goHome} />}
        {page === 'bridal' && <BridalPartyPage bridal={bridal} onBack={goHome} />}
        {page === 'family' && <KeyFamilyPage onBack={goHome} />}
        {page === 'menu' && <MenuPage content={content} onBack={goHome} />}
        {page === 'love' && <LoveWisdomPage onBack={goHome} />}
        {page === 'seating' && <SeatingPlanPage guests={guests} onBack={goHome} />}
      </FadeInPage>

      <Footer />
    </div>
  );
}
