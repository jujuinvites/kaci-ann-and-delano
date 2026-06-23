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
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(5px); }
        }
      @keyframes floatY {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-10px); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(32px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      /* Press feedback — every clickable element */
      button:active, a:active {
        transform: scale(0.97) !important;
        transition: transform 120ms cubic-bezier(0.22,1,0.36,1) !important;
      }

      /* Hover effects only on devices that support hover */
      @media (hover: hover) and (pointer: fine) {
        .explore-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 16px 36px rgba(80,120,150,0.20);
        }
        .explore-card:hover .explore-icon {
          transform: scale(1.10);
        }
        .explore-card {
          will-change: transform;
        }
        .soft-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(80,120,150,0.16);
        }
        .love-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(90,136,168,0.14);
        }
        .nav-menu-item:hover {
          background: rgba(90,136,168,0.06) !important;
        }
      }

      /* Respect reduced-motion preferences */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0ms !important;
          transition-duration: 0.01ms !important;
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
  dustyBlue: '#5a88a8',
  blueMid: '#7aaac4',
  bluePale: '#ddeef6',
  cream: '#f4f9fc',
  beigeBg: '#e2eff8',
  pageBg: '#f4f9fc',
  cardBg: '#ffffff',
  cardShadow: '0 4px 20px rgba(80,120,150,0.10)',
  text: '#1e2d3d',
  textSoft: '#5a7a8e',
  divider: 'rgba(90,136,168,0.18)',

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
    waxSeal2Image: '/images/wax-seal2.png',
    orchidImage: '/images/orchid.png',
    leavesImage: '/images/leaves.png',
    leaves2Image: '/images/leaves2.png',
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
  ]
};

const DEFAULT_KEY_FAMILY = [
  {
    group: 'Key Family Members',
    members: [
      { role: 'Mother of Bride', names: ['Ms. Shelian Samuels'] },
      { role: 'Father of Bride', names: ['Mr. Michael Russell'] },
      { role: 'Mother of Groom', names: ['Rev. Deloris Trowers'] },
      { role: 'Father of Groom', names: ['Mr. Adrian Huntley'] },
    ]
  },
  {
    group: 'Key Participants',
    members: [
      { role: 'Officiant', names: ['Bishop Vernon Morrison'] },
      { role: 'Soloist', names: ['Ms. Shanique Davis'] },
      { role: 'Sand Ceremony', names: ['Minister Mavis Bailey'] },
      { role: 'Prayer for Couple', names: ['Minister Jacqueline Richards'] },
      { role: 'Scripture Readers', names: ['Ms. Shelian Samuels', 'Mr. Adrian Huntley'] },
      { role: 'Master of Ceremony', names: ["Bishop Marlon O'Leslie"] },
      { role: 'Blessing of Meal & Cake', names: ['Sis. Joan Douglas'] },
    ]
  }
];

const CEREMONY_PROGRAMME = [
  { item: 'Processional' },
  { item: 'Musical Prelude' },
  { item: 'Seating of Family & Guests' },
  { item: 'Entrance', subItems: ["Groom's Parents", "Grandparents of the Couple", "Bridal Party", "Ring Bearer & Flower Girls"] },
  { item: "Bride's Entrance" },
  { item: 'Opening Song' },
  { item: 'Officiant', participant: 'Bishop Vernon Morrison' },
  { item: 'Invocation', participant: 'Rev. Deloris Trowers' },
  { item: 'Welcome' },
  { item: 'Scripture Readings', subItems: [
    'Psalms 128 — Mr. Adrian Huntley (Father of Groom)',
    'Ecclesiastes 4:9–12 — Ms. Shelian Samuels (Mother of Bride)'
  ]},
  { item: "Officiant's Address to the Couple" },
  { item: 'Exchange of Vows & Rings' },
  { item: 'Signing of the Registry', detail: 'An instrumental will be played' },
  { item: 'Unity Ceremony', detail: 'The Sand Ceremony', participant: 'Minister Mavis Bailey' },
  { item: 'Special Item', detail: 'Soloist', participant: 'Sis. Shanique Davis' },
  { item: 'Blessing & Prayer for the Couple', participant: 'Minister Jacqueline Richards' },
  { item: 'Pronouncement' },
  { item: 'Recessional' },
];

const COCKTAIL_PROGRAMME = [
  { item: 'Refreshments', subItems: ['Water', 'Juice', 'Soup'] },
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
  { item: 'Blessing of Meal & Cake', participant: 'Sis. Joan Douglas' },
  { item: 'Serving of Dishes' },
  { item: 'Toast & Speeches', subItems: [
    'To the Bride — Mrs. Kendra Simpson (Matron of Honour)',
    'To the Groom — Mr. Alex Russell (Best Man)',
    "To Bride's Parents — Mr. Damion Matthews",
    "To Groom's Parents — Minister Jacqueline Richards",
    'Open Toast (2–3)',
    "Groom's Response"
  ]},
  { item: 'Unveiling of Cake', detail: 'Mothers of the Couple' },
  { item: 'Cutting & Feeding of Cake' },
  { item: 'Games', subItems: ["Couple's Shoe Game", 'Removing of Garter', 'Tossing of Bouquet', 'Tossing of Garter'] },
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
    const si = headers.indexOf('reserved seat') !== -1 ? headers.indexOf('reserved seat') : headers.indexOf('seat');
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

const SectionHeader = ({ overline, title, subtitle, light }) => (
  <div style={{ textAlign: 'center', marginBottom: 40 }}>
    {overline && (
      <div style={{
        fontFamily: theme.fonts.body,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 4,
        textTransform: 'uppercase',
        color: light ? 'rgba(255,255,255,0.75)' : theme.dustyBlue,
        marginBottom: 12,
        animation: 'fadeIn 0.6s cubic-bezier(0.23,1,0.32,1) both',
        animationDelay: '0.05s'
      }}>
        {overline}
      </div>
    )}
    <h2 style={{
      fontFamily: theme.fonts.script,
      fontSize: 'clamp(58px, 12vw, 82px)',
      fontWeight: 400,
      color: light ? '#fff' : theme.dustyBlue,
      margin: 0,
      lineHeight: 1.15,
      animation: 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) both',
      animationDelay: '0.12s'
    }}>
      {title}
    </h2>
    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', animation: 'fadeIn 0.6s cubic-bezier(0.23,1,0.32,1) both', animationDelay: '0.2s' }}>
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
        <circle cx="13" cy="12" r="9" stroke={light ? 'rgba(255,255,255,0.4)' : 'rgba(90,136,168,0.45)'} strokeWidth="1.2"/>
        <circle cx="27" cy="12" r="9" stroke={light ? 'rgba(255,255,255,0.4)' : 'rgba(90,136,168,0.45)'} strokeWidth="1.2"/>
      </svg>
    </div>
    {subtitle && (
      <p style={{
        fontFamily: theme.fonts.title,
        fontSize: 17,
        fontStyle: 'italic',
        color: light ? 'rgba(255,255,255,0.80)' : theme.textSoft,
        margin: '12px 0 0',
        lineHeight: 1.6,
        animation: 'fadeIn 0.6s cubic-bezier(0.23,1,0.32,1) both',
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

const BackLink = ({ onBack, light }) => (
  <button
    onClick={onBack}
    style={{
      background: 'transparent',
      border: 'none',
      color: light ? 'rgba(255,255,255,0.75)' : theme.dustyBlue,
      fontFamily: theme.fonts.body,
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 20,
      padding: 0,
      cursor: 'pointer',
      animation: 'fadeIn 0.4s cubic-bezier(0.23,1,0.32,1) both',
      display: 'block'
    }}
  >
    ← Back to Main Menu
  </button>
);

/* =============================================================
   SCROLL DOWN INDICATOR
   ============================================================= */
function ScrollDownIndicator() {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const check = () => {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      const tooShort = document.documentElement.scrollHeight <= window.innerHeight + 40;
      setVisible(!atBottom && !tooShort);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 22, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      animation: 'scrollBounce 1.6s ease-in-out infinite',
      pointerEvents: 'none',
      background: 'rgba(44,72,112,0.45)',
      backdropFilter: 'blur(8px)',
      borderRadius: 20,
      padding: '7px 16px 9px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.18)'
    }}>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff' }}>Scroll</span>
      <svg width="16" height="10" viewBox="0 0 18 11" fill="none">
        <polyline points="1,1 9,9 17,1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

/* =============================================================
   HEADER / NAV
   ============================================================= */
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'timeline', label: 'Wedding Timeline' },
  { id: 'ceremony', label: 'Ceremony Programme' },
  { id: 'reception', label: 'Reception Programme' },
  { id: 'bridal', label: 'Bridal Party' },
  { id: 'family', label: 'Key Family Members & Participants' },
  { id: 'seating', label: 'Seating Plan' },
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
        background: 'rgba(244,249,252,0.92)',
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
            style={{ flex: 1, background: 'rgba(0,0,0,0.35)', animation: 'fadeIn 0.25s cubic-bezier(0.23,1,0.32,1) both' }}
          />
          <div style={{
            width: 300,
            background: '#ffffff',
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
                    animation: `fadeInUp 0.35s cubic-bezier(0.23,1,0.32,1) both`,
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
        src="/images/footer.gif"
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
      background: 'linear-gradient(to bottom, #ddeef8 0%, #c8dff2 45%, #aecce6 100%)',
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
          animation: 'fadeInUp 0.45s cubic-bezier(0.23,1,0.32,1) both',
          animationDelay: '0.05s'
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
            animation: 'fadeInUp 0.42s cubic-bezier(0.23,1,0.32,1) both',
            animationDelay: '0.15s'
          }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          marginBottom: 22,
          animation: 'fadeIn 0.4s cubic-bezier(0.23,1,0.32,1) both',
          animationDelay: '0.28s'
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
          animation: 'fadeInUp 0.45s cubic-bezier(0.23,1,0.32,1) both',
          animationDelay: '0.36s'
        }}>
          {content.date}
        </div>

        <div style={{
          fontFamily: theme.fonts.title,
          fontSize: 17,
          fontStyle: 'italic',
          color: theme.textSoft,
          marginBottom: 36,
          animation: 'fadeInUp 0.45s cubic-bezier(0.23,1,0.32,1) both',
          animationDelay: '0.44s'
        }}>
          {content.venueLine1}
        </div>

        <p style={{
          fontFamily: theme.fonts.body,
          fontSize: 17,
          color: theme.textSoft,
          lineHeight: 1.8,
          maxWidth: 480,
          margin: '0 auto',
          animation: 'fadeInUp 0.45s cubic-bezier(0.23,1,0.32,1) both',
          animationDelay: '0.52s'
        }}>
          {content.welcomeMessage}
        </p>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '20px 24px 68px',
        animation: 'fadeInUp 0.5s cubic-bezier(0.23,1,0.32,1) both',
        animationDelay: '0.6s'
      }}>
        <div style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#5a7a8e',
          marginBottom: 16
        }}>
          Don't forget to use our hashtags — we'd love to see them!
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 20px' }}>
          {['#HappilyEverHuntley', '#HuntleyHarmony', '#HuntleyHolyUnion', '#HeavenlyHitchedHuntleys'].map(tag => (
            <div key={tag} style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: '#5a88a8',
              whiteSpace: 'nowrap'
            }}>
              {tag}
            </div>
          ))}
        </div>
      </div>

      <img
        src={theme.images.flowersImage}
        alt=""
        aria-hidden
        style={{
          width: '100%',
          display: 'block',
          animation: 'fadeIn 0.7s cubic-bezier(0.23,1,0.32,1) both',
          animationDelay: '0.2s'
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
  const [status, setStatus] = useState('idle'); // idle | loading | results | none
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const resultRef = React.useRef(null);

  function getTable(g) {
    if (!g.table && ['bride','groom'].includes((g.group||'').toLowerCase())) return 'Sweetheart';
    return g.table || '—';
  }

  const handleSearch = (e) => {
    e?.preventDefault?.();
    const q = query.trim();
    if (!q) return;
    setStatus('loading');
    setResults([]);
    setSelected(null);
    setTimeout(() => {
      const found = guests.filter(g => (g.name || '').toLowerCase().includes(q.toLowerCase()));
      setResults(found);
      setStatus(found.length > 0 ? 'results' : 'none');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    }, 600);
  };

  return (
    <Section style={{ paddingTop: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 style={{
          fontFamily: theme.fonts.script,
          fontSize: 'clamp(58px, 12vw, 82px)',
          fontWeight: 400,
          color: theme.text,
          margin: '0 0 8px'
        }}>
          Find Your Seat
        </h2>
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: 14,
          color: theme.textSoft
        }}>
          Type your name to find your table
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter your full name"
            autoComplete="off"
            spellCheck="false"
            style={{
              flex: '1 1 200px',
              minWidth: 0,
              padding: '14px 18px',
              border: `2px solid ${status === 'none' ? '#e0a0a0' : 'rgba(90,136,168,0.35)'}`,
              borderRadius: 14,
              fontFamily: theme.fonts.body,
              fontSize: 16,
              color: theme.text,
              background: 'rgba(255,255,255,0.88)',
              outline: 'none',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
            onFocus={e => { e.target.style.borderColor = theme.dustyBlue; e.target.style.boxShadow = '0 0 0 4px rgba(90,136,168,0.15)'; }}
            onBlur={e => { e.target.style.borderColor = status === 'none' ? '#e0a0a0' : 'rgba(90,136,168,0.35)'; e.target.style.boxShadow = 'none'; }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '14px 24px',
              border: 'none',
              borderRadius: 14,
              background: `linear-gradient(135deg, ${theme.dustyBlue} 0%, #3d6880 100%)`,
              color: '#fff',
              fontFamily: theme.fonts.body,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(61,104,128,0.32)',
              transition: 'transform 160ms cubic-bezier(0.22,1,0.36,1), box-shadow 160ms ease',
              whiteSpace: 'nowrap',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (status !== 'loading') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(61,104,128,0.38)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(61,104,128,0.32)'; }}
          >
            {status === 'loading' ? 'Finding your seat…' : 'Find My Seat'}
          </button>
        </div>
      </form>

      <div ref={resultRef} style={{ maxWidth: 480, margin: '20px auto 0' }}>

        {/* Single result OR selected from multi-result */}
        {status === 'results' && (results.length === 1 || selected) && (() => {
          const g = selected || results[0];
          const tbl = getTable(g);
          return (
            <div style={{ animation: 'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
              {selected && (
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: theme.fonts.body, fontSize: 13, color: theme.dustyBlue, letterSpacing: '0.06em', marginBottom: 14, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ← Back to results
                </button>
              )}
              <div style={{
                background: 'linear-gradient(160deg, #fff 0%, #eef5fb 100%)',
                border: '1px solid rgba(90,136,168,0.20)',
                borderRadius: 20,
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: '0 6px 28px rgba(60,100,140,0.12)',
              }}>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 15, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.dustyBlue, marginBottom: 4 }}>
                  We found your seat!
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 17, color: theme.textSoft, marginBottom: 14 }}>
                  Welcome, you're seated at:
                </div>
                <div style={{ fontFamily: theme.fonts.names, fontSize: 'clamp(20px,4.5vw,26px)', color: theme.text, marginBottom: 24, lineHeight: 1.3 }}>
                  {g.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px 14px', marginBottom: 24 }}>
                  <div style={{ background: '#ddeaf5', border: '1.5px solid rgba(90,136,168,0.22)', borderRadius: 14, padding: '12px 24px', minWidth: 90 }}>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3d6880', marginBottom: 5 }}>Table</div>
                    <div style={{ fontFamily: theme.fonts.names, fontSize: 28, fontWeight: 700, color: theme.text }}>{tbl}</div>
                  </div>
                  {g.seat && (
                    <div style={{ background: '#ddeaf5', border: '1.5px solid rgba(90,136,168,0.22)', borderRadius: 14, padding: '12px 24px', minWidth: 90 }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3d6880', marginBottom: 5 }}>Seat</div>
                      <div style={{ fontFamily: theme.fonts.names, fontSize: 28, fontWeight: 700, color: theme.text }}>{g.seat}</div>
                    </div>
                  )}
                  {g.group && (
                    <div style={{ background: '#ddeaf5', border: '1.5px solid rgba(90,136,168,0.22)', borderRadius: 14, padding: '12px 24px', minWidth: 90 }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3d6880', marginBottom: 5 }}>Group</div>
                      <div style={{ fontFamily: theme.fonts.names, fontSize: 16, fontWeight: 600, color: theme.text }}>{g.group}</div>
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 17, color: theme.textSoft, paddingTop: 16, borderTop: '1px solid rgba(90,136,168,0.14)', lineHeight: 1.7 }}>
                  We can't wait to celebrate with you!
                </div>
              </div>
            </div>
          );
        })()}

        {/* Multiple results list */}
        {status === 'results' && results.length > 1 && !selected && (
          <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.textSoft, textAlign: 'center', marginBottom: 12, letterSpacing: '0.04em' }}>
              {results.length} guests found — tap your name
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map((g, i) => (
                <button key={i} onClick={() => setSelected(g)} style={{
                  background: 'linear-gradient(160deg, #fff 0%, #eef5fb 100%)',
                  border: '1px solid rgba(90,136,168,0.18)',
                  borderRadius: 16,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 4px 14px rgba(60,100,140,0.08)',
                  animation: 'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                  animationDelay: `${i * 0.06}s`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  justifyContent: 'space-between',
                  transition: 'transform 160ms cubic-bezier(0.22,1,0.36,1), box-shadow 160ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(60,100,140,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(60,100,140,0.08)'; }}
                >
                  <span style={{ fontFamily: theme.fonts.names, fontSize: 17, color: theme.text }}>{g.name}</span>
                  <span style={{ fontFamily: theme.fonts.body, fontSize: 15, color: theme.textSoft, flexShrink: 0 }}>Table {getTable(g)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No result */}
        {status === 'none' && (
          <div style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px dashed rgba(90,136,168,0.30)',
            borderRadius: 16,
            padding: '24px 20px',
            textAlign: 'center',
            animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.textSoft, lineHeight: 1.65 }}>
              We couldn't find <strong style={{ color: '#3d6880' }}>"{query}"</strong> on the guest list.<br />
              Please check the spelling or visit the welcome desk — we'll help you out!
            </div>
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
  { id: 'timeline',  title: 'Wedding Timeline',        img: '/images/icons/5.png'  },
  { id: 'ceremony',  title: 'Ceremony Programme',       img: '/images/icons/6.png'  },
  { id: 'reception', title: 'Reception Programme',      img: '/images/icons/10.png' },
  { id: 'bridal',    title: 'Bridal Party',             img: '/images/icons/7.png'  },
  { id: 'family',    title: 'Key Family & Participants', img: '/images/icons/8.png'  },
  { id: 'seating',   title: 'Seating Plan',             img: '/images/icons/9.png'  },
  { id: 'menu',      title: 'Menu',                     img: '/images/icons/11.png' },
  { id: 'love',      title: 'Love & Wisdom',            img: '/images/icons/12.png' },
];

function ExploreGrid({ onNavigate }) {
  return (
    <div style={{ padding: '36px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{
          fontFamily: theme.fonts.script,
          fontSize: 'clamp(58px, 12vw, 82px)',
          fontWeight: 400,
          color: theme.text,
          margin: '0 0 8px',
          animation: 'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
          animationDelay: '0.05s'
        }}>
          Explore the Day
        </h2>
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: theme.dustyBlue,
          animation: 'fadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
          animationDelay: '0.2s'
        }}>
          Tap to navigate
        </div>
      </div>

      <div style={{
        display: 'grid',
        gap: 10,
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        maxWidth: 880,
        margin: '0 auto'
      }}>
        {EXPLORE_CARDS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onNavigate(c.id)}
            className="explore-card"
            style={{
              background: 'rgba(255,255,255,0.60)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.75)',
              borderRadius: 18,
              padding: '6px 5%',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms ease-out',
              boxShadow: '0 4px 20px rgba(80,120,160,0.12)',
              animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.05 + i * 0.07}s`
            }}
          >
            <img
              src={c.img}
              alt={c.title}
              className="explore-icon"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                mixBlendMode: 'multiply',
                transform: 'scale(1.3)',
                transition: 'transform 180ms cubic-bezier(0.22,1,0.36,1)'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* =============================================================
   PAGE: TIMELINE
   ============================================================= */
const TIMELINE_ICON_SRCS = [
  { src: '/images/timeline/1.png', dark: false }, // Guest Arrival — white bg, use brightness boost to lighten strokes for multiply
  { src: '/images/timeline/2.png', dark: true  }, // Ceremony Begins — dark bg
  { src: '/images/timeline/3.png', dark: true  }, // Cocktail Hour — dark bg
  { src: '/images/timeline/4.png', dark: true  }, // Reception — dark bg
  { src: '/images/timeline/5.png', dark: true  }, // Send Off — dark bg
];

function TimelinePage({ content, onBack }) {
  return (
    <>
      <div style={{ padding: '20px 20px 0' }}>
        <BackLink onBack={onBack} />
      </div>
      <Section>
        <SectionHeader overline="The day at a glance" title="Timeline" />

      <div style={{ maxWidth: 460, margin: '0 auto', position: 'relative', padding: '12px 8px 32px' }}>
        {/* Centre vertical line */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 1, background: theme.dustyBlue, opacity: 0.35,
          transform: 'translateX(-50%)', pointerEvents: 'none'
        }} />

        {content.timeline.map((t, i) => {
          const iconLeft = i % 2 === 0;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', position: 'relative',
              marginBottom: i < content.timeline.length - 1 ? 36 : 0,
              animation: 'fadeInUp 0.42s cubic-bezier(0.23,1,0.32,1) both',
              animationDelay: `${0.15 + i * 0.1}s`
            }}>
              {/* Left cell */}
              <div style={{
                flex: 1, display: 'flex',
                justifyContent: iconLeft ? 'center' : 'flex-end',
                paddingRight: iconLeft ? 0 : 20
              }}>
                {iconLeft
                  ? <img src={TIMELINE_ICON_SRCS[i].src} alt={t.title} style={{ width: 78, height: 78, objectFit: 'contain', mixBlendMode: 'overlay', opacity: 0.8, filter: 'none', transform: 'translateX(15px)' }} />
                  : <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 17, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: theme.dustyBlue, marginBottom: 3 }}>{t.time}</div>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: theme.text, lineHeight: 1.35 }}>{t.title}</div>
                    </div>
                }
              </div>

              {/* Crossbar at centre */}
              <div style={{
                position: 'absolute', left: '50%', top: '50%',
                width: 18, height: 1, background: theme.dustyBlue, opacity: 0.6,
                transform: 'translate(-50%, -50%)'
              }} />

              {/* Right cell */}
              <div style={{
                flex: 1, display: 'flex',
                justifyContent: iconLeft ? 'flex-start' : 'center',
                paddingLeft: iconLeft ? 20 : 0
              }}>
                {iconLeft
                  ? <div style={{ textAlign: 'left' }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 17, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: theme.dustyBlue, marginBottom: 3 }}>{t.time}</div>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: theme.text, lineHeight: 1.35 }}>{t.title}</div>
                    </div>
                  : <img src={TIMELINE_ICON_SRCS[i].src} alt={t.title} style={{ width: 78, height: 78, objectFit: 'contain', mixBlendMode: 'multiply', filter: TIMELINE_ICON_SRCS[i].dark ? 'invert(1) hue-rotate(180deg) saturate(1.8) brightness(0.55)' : 'brightness(4) saturate(0.55)', transform: 'translateX(-15px)' }} />
                }
              </div>
            </div>
          );
        })}
      </div>
    </Section>
    </>
  );
}

/* =============================================================
   PAGE: MENU
   ============================================================= */
function MenuPage({ content, onBack }) {
  return (
    <>
      <div style={{ padding: '20px 20px 0' }}>
        <BackLink onBack={onBack} />
      </div>
      <Section>
        <SectionHeader overline="Tonight's Table" title="Menu" subtitle={content.menuNote} />
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        {content.menu.map((sec, i) => (
          <div
            key={i}
            style={{
              marginBottom: 44,
              animation: 'fadeInUp 0.42s cubic-bezier(0.23,1,0.32,1) both',
              animationDelay: `${0.2 + i * 0.12}s`
            }}
          >
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 21,
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
                fontSize: 23,
                color: theme.text,
                margin: '8px 0',
                lineHeight: 1.6
              }}>
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
    </>
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
      background: 'linear-gradient(175deg, #d4e8f4 0%, #ddeef6 55%, #e8f4fa 100%)',
      minHeight: '100vh',
      paddingBottom: 72
    }}>
      <div style={{ padding: '20px 24px 0' }}>
        <BackLink onBack={onBack} />
      </div>
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '44px 24px 0' }}>
        <SectionHeader overline="Table Activities" title="Love & Wisdom" />

        <p style={{
          fontFamily: theme.fonts.body,
          fontSize: 17,
          color: theme.dustyBlue,
          lineHeight: 2,
          textAlign: 'center',
          margin: '0 auto 40px',
          maxWidth: 460,
          animation: 'fadeIn 0.7s cubic-bezier(0.23,1,0.32,1) both',
          animationDelay: '0.3s'
        }}>
          {intro}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activities.map((activity, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.65)',
                border: `1px solid rgba(90,136,168,0.12)`,
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
                  fontSize: 22,
                  fontWeight: 500,
                  color: theme.text,
                  marginBottom: 8,
                  letterSpacing: 0.3
                }}>
                  {activity.title}
                </div>
                <div style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 17,
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
    <div style={{ background: '#2c4870', minHeight: '100vh', paddingBottom: 20 }}>
      <div style={{ padding: '20px 20px 0' }}>
        <BackLink onBack={onBack} light />
      </div>
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <img src={theme.images.waxSeal2Image} alt="K & D seal" style={{ width: 110, opacity: 0.9, animation: 'scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both' }} onError={e => { e.currentTarget.style.display='none'; }} />
        </div>
        <SectionHeader overline="By Our Side" title="Bridal Party" light />
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <p style={{
          fontFamily: theme.fonts.body, fontSize: 17,
          color: 'rgba(255,255,255,0.75)', textAlign: 'center',
          lineHeight: 1.8, marginBottom: 48, padding: '0 8px'
        }}>
          These are the beautiful souls who stood by our side, cheered us on, and made this day even more special. We are so grateful to have you with us.
        </p>
        {roles.map((item, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              padding: '32px 0',
              borderBottom: i < roles.length - 1 ? `1px solid rgba(255,255,255,0.18)` : 'none',
              animation: 'fadeInUp 0.42s cubic-bezier(0.23,1,0.32,1) both',
              animationDelay: `${0.1 + i * 0.09}s`
            }}
          >
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)',
              marginBottom: 14
            }}>
              {item.role}
            </div>
            {(item.names || []).map((name, j) => (
              <div key={j} style={{
                fontFamily: theme.fonts.title,
                fontSize: 'clamp(23px, 4.5vw, 29px)',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1.5
              }}>
                {name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
    </div>
  );
}

/* =============================================================
   PROGRAMME SHARED COMPONENTS
   ============================================================= */

/* Solid dusty-blue page bg used across both programme pages */
const PROG_BG = '#7a8fa8';
const PROG_CARD_BG = 'rgba(255,255,255,0.14)';
const PROG_CARD_BG_SOLID = '#8ea4b8'; /* slightly lighter for contrast */

const ProgrammeSectionHeader = ({ overline, title, subtitle }) => (
  <div style={{ textAlign: 'center', padding: '8px 0 28px', position: 'relative' }}>
    {overline && (
      <div style={{
        fontFamily: theme.fonts.body, fontSize: 15,
        fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.75)', marginBottom: 6
      }}>
        {overline}
      </div>
    )}
    <div style={{
      fontFamily: theme.fonts.script,
      fontSize: 'clamp(58px, 13vw, 82px)',
      color: '#fff', lineHeight: 1.05,
    }}>
      {title}
    </div>
    {subtitle && (
      <p style={{
        fontFamily: theme.fonts.body,
        fontSize: 17,
        color: 'rgba(255,255,255,0.75)',
        margin: '10px 0 0',
        lineHeight: 1.6,
      }}>
        {subtitle}
      </p>
    )}
    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
        <circle cx="13" cy="12" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
        <circle cx="27" cy="12" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
      </svg>
    </div>
  </div>
);

const ProgrammeItemRow = ({ item, delay }) => (
  <div style={{
    width: '100%',
    padding: '13px 20px 14px',
    marginBottom: 7,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.28)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.25)',
    textAlign: 'center',
    animation: 'fadeInUp 0.45s cubic-bezier(0.23,1,0.32,1) both',
    animationDelay: `${delay}s`,
    boxSizing: 'border-box',
  }}>
    {/* Primary heading — ALL CAPS */}
    <div style={{
      fontFamily: theme.fonts.body, fontSize: 16,
      color: '#fff', fontWeight: 700,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      lineHeight: 1.4
    }}>
      {item.item}
    </div>

    {/* Sub-items list (e.g. Entrance processional order) */}
    {item.subItems && (
      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {item.subItems.map((s, i) => (
          <div key={i} style={{
            fontFamily: theme.fonts.title, fontSize: 17,
            fontStyle: 'italic', color: 'rgba(255,255,255,0.88)',
            letterSpacing: '0.02em', lineHeight: 1.5
          }}>
            {s}
          </div>
        ))}
      </div>
    )}

    {/* Inline detail (e.g. "Ministry of Song", "The Sand Ceremony") */}
    {item.detail && (
      <div style={{
        fontFamily: theme.fonts.title, fontSize: 17,
        fontStyle: 'italic', color: 'rgba(255,255,255,0.84)',
        marginTop: 5, lineHeight: 1.5, letterSpacing: '0.02em'
      }}>
        {item.detail}
      </div>
    )}

    {/* Named participant — Playfair italic at readable size */}
    {item.participant && (
      <div style={{
        fontFamily: theme.fonts.title, fontSize: 19,
        fontStyle: 'italic', fontWeight: 600,
        color: 'rgba(255,255,255,0.95)', marginTop: 5, lineHeight: 1.3
      }}>
        {item.participant}
      </div>
    )}
  </div>
);

/* =============================================================
   PAGE: CEREMONY PROGRAMME
   ============================================================= */
function CeremonyProgrammePage({ onBack }) {
  return (
    <div style={{ background: PROG_BG, minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 20px 0' }}>
        <BackLink onBack={onBack} light />

        {/* Wax seal top center */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <img src={theme.images.waxSeal2Image} alt="K & D seal" style={{
            width: 110, opacity: 0.9,
            animation: 'scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both'
          }} onError={e => { e.currentTarget.style.display='none'; }} />
        </div>

        <ProgrammeSectionHeader overline="Order of Service" title="Ceremony" />

        {/* Courtesy note */}
        <p style={{
          fontFamily: theme.fonts.title, fontSize: 17, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.80)', textAlign: 'center',
          margin: '-12px 0 20px', lineHeight: 1.6, letterSpacing: '0.02em'
        }}>
          Thank you for joining us as we exchange vows and begin our forever.
        </p>

        {CEREMONY_PROGRAMME.map((item, i) => (
          <ProgrammeItemRow key={i} item={item} delay={0.05 + i * 0.035} />
        ))}

        <div style={{ marginTop: 40 }}>
          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.22)' }} />
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
              <circle cx="22" cy="10" r="8" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            </svg>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.22)' }} />
          </div>
          <ProgrammeSectionHeader overline="Following the Ceremony" title="Cocktail Hour" />
          {COCKTAIL_PROGRAMME.map((item, i) => (
            <ProgrammeItemRow key={i} item={item} delay={0.05 + i * 0.06} />
          ))}
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
    <div style={{ background: PROG_BG, minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 20px 0' }}>
        <BackLink onBack={onBack} light />

        {/* Wax seal top center */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <img src={theme.images.waxSeal2Image} alt="K & D seal" style={{
            width: 110, opacity: 0.9,
            animation: 'scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both'
          }} onError={e => { e.currentTarget.style.display='none'; }} />
        </div>

        <ProgrammeSectionHeader overline="Evening Celebration" title="Reception" subtitle="Dinner, dancing & unforgettable memories" />
        {RECEPTION_PROGRAMME.map((item, i) => (
          <ProgrammeItemRow key={i} item={item} delay={0.05 + i * 0.04} />
        ))}
      </div>
    </div>
  );
}

/* =============================================================
   PAGE: KEY FAMILY MEMBERS & PARTICIPANTS
   ============================================================= */
function KeyFamilyPage({ onBack }) {
  return (
    <div style={{ background: '#2c4870', minHeight: '100vh', paddingBottom: 20 }}>
      <div style={{ padding: '20px 20px 0' }}>
        <BackLink onBack={onBack} light />
      </div>
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <img src={theme.images.waxSeal2Image} alt="K & D seal" style={{ width: 110, opacity: 0.9, animation: 'scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both' }} onError={e => { e.currentTarget.style.display='none'; }} />
        </div>
        <SectionHeader overline="With Gratitude" title="Our People" light />
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <p style={{
          fontFamily: theme.fonts.body, fontSize: 17,
          color: 'rgba(255,255,255,0.75)', textAlign: 'center',
          lineHeight: 1.8, marginBottom: 48, padding: '0 8px'
        }}>
          We are deeply grateful for the love and support of our family and the special individuals who have walked alongside us. Thank you for being part of this beautiful journey.
        </p>
        {DEFAULT_KEY_FAMILY.map((group, gi) => (
          <div key={gi} style={{ marginBottom: gi < DEFAULT_KEY_FAMILY.length - 1 ? 80 : 52, paddingTop: gi > 0 ? 16 : 0 }}>
            <div style={{
              fontFamily: theme.fonts.body, fontSize: 21,
              fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.90)', textAlign: 'center',
              paddingBottom: 14, marginBottom: 24,
              borderBottom: '1px solid rgba(255,255,255,0.18)'
            }}>
              {group.group}
            </div>
            {group.members.map((member, mi) => (
              <div key={mi} style={{
                textAlign: 'center', padding: '24px 0',
                borderBottom: mi < group.members.length - 1 ? `1px solid rgba(255,255,255,0.18)` : 'none',
                animation: 'fadeInUp 0.42s cubic-bezier(0.23,1,0.32,1) both',
                animationDelay: `${0.1 + (gi * 4 + mi) * 0.08}s`
              }}>
                <div style={{
                  fontFamily: theme.fonts.body, fontSize: 15,
                  fontWeight: 700, letterSpacing: 4,
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
                  marginBottom: 10
                }}>
                  {member.role}
                </div>
                {member.names.map((name, ni) => (
                  <div key={ni} style={{
                    fontFamily: theme.fonts.title,
                    fontSize: 'clamp(23px, 4.5vw, 29px)',
                    fontWeight: 400, color: '#fff', lineHeight: 1.5
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
    </div>
  );
}

/* =============================================================
   PAGE: SEATING PLAN
   ============================================================= */
function SeatingFinder({ guests }) {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('idle'); // idle | loading | results | none
  const [results, setResults] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const resultRef = React.useRef(null);

  function doSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setStatus('loading');
    setResults([]);
    setSelected(null);
    setTimeout(() => {
      const q2 = q.toLowerCase();
      const found = guests.filter(g => (g.name || '').toLowerCase().includes(q2));
      setResults(found);
      setStatus(found.length > 0 ? 'results' : 'none');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    }, 600);
  }

  function getTable(g) {
    if (!g.table && ['bride','groom'].includes((g.group||'').toLowerCase())) return 'Sweetheart';
    return g.table || '—';
  }

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.dustyBlue, marginBottom: 10 }}>
          Find Your Seat
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 15, color: theme.textSoft }}>
          Type your name to find your table
        </div>
      </div>

      {/* Search form — stacked column for mobile */}
      <form onSubmit={doSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter your full name"
          autoComplete="off"
          spellCheck="false"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '16px 20px',
            border: `2.5px solid ${status === 'none' ? '#d9534f' : theme.dustyBlue}`,
            borderRadius: 14,
            fontFamily: theme.fonts.body,
            fontSize: 17,
            color: '#1a2a38',
            background: '#ffffff',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(61,104,128,0.10)',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
          }}
          onFocus={e => { e.target.style.borderColor = '#2c5f7a'; e.target.style.boxShadow = '0 0 0 4px rgba(90,136,168,0.18)'; }}
          onBlur={e => { e.target.style.borderColor = status === 'none' ? '#d9534f' : theme.dustyBlue; e.target.style.boxShadow = '0 2px 8px rgba(61,104,128,0.10)'; }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            width: '100%',
            padding: '16px 24px',
            border: 'none',
            borderRadius: 14,
            background: status === 'loading'
              ? 'rgba(90,136,168,0.55)'
              : `linear-gradient(135deg, #3d6880 0%, ${theme.dustyBlue} 100%)`,
            color: '#ffffff',
            fontFamily: theme.fonts.body,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            boxShadow: status === 'loading' ? 'none' : '0 4px 18px rgba(61,104,128,0.38)',
            transition: 'background 200ms ease, box-shadow 200ms ease, transform 160ms cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={e => { if (status !== 'loading') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(61,104,128,0.44)'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = status === 'loading' ? 'none' : '0 4px 18px rgba(61,104,128,0.38)'; }}
        >
          {status === 'loading' ? 'Finding your seat…' : 'Find My Seat'}
        </button>
      </form>

      {/* Results */}
      <div ref={resultRef} style={{ maxWidth: 480, margin: '20px auto 0' }}>

        {/* Single result OR selected from multi-result */}
        {status === 'results' && (results.length === 1 || selected) && (() => {
          const g = selected || results[0];
          const tbl = getTable(g);
          return (
            <div style={{ animation: 'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
              {selected && (
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: theme.fonts.body, fontSize: 13, color: theme.dustyBlue, letterSpacing: '0.06em', marginBottom: 14, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ← Back to results
                </button>
              )}
              <div style={{
                background: 'linear-gradient(160deg, #ffffff 0%, #eef5fb 100%)',
                border: '1.5px solid rgba(90,136,168,0.22)',
                borderRadius: 22,
                padding: '32px 28px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(60,100,140,0.14)',
              }}>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 15, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.dustyBlue, marginBottom: 4 }}>
                  We found your seat!
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 17, color: theme.textSoft, marginBottom: 14 }}>
                  Welcome, you're seated at:
                </div>
                <div style={{ fontFamily: theme.fonts.names, fontSize: 'clamp(22px,4.5vw,28px)', fontWeight: 600, color: '#1a2a38', marginBottom: 24, lineHeight: 1.3 }}>
                  {g.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px 14px', marginBottom: 24 }}>
                  <div style={{ background: '#ddeaf5', border: '1.5px solid rgba(90,136,168,0.22)', borderRadius: 14, padding: '12px 24px', minWidth: 90 }}>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3d6880', marginBottom: 5 }}>Table</div>
                    <div style={{ fontFamily: theme.fonts.names, fontSize: 28, fontWeight: 700, color: '#1a2a38' }}>{tbl}</div>
                  </div>
                  {g.seat && (
                    <div style={{ background: '#ddeaf5', border: '1.5px solid rgba(90,136,168,0.22)', borderRadius: 14, padding: '12px 24px', minWidth: 90 }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3d6880', marginBottom: 5 }}>Seat</div>
                      <div style={{ fontFamily: theme.fonts.names, fontSize: 28, fontWeight: 700, color: '#1a2a38' }}>{g.seat}</div>
                    </div>
                  )}
                  {g.group && (
                    <div style={{ background: '#ddeaf5', border: '1.5px solid rgba(90,136,168,0.22)', borderRadius: 14, padding: '12px 24px', minWidth: 90 }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3d6880', marginBottom: 5 }}>Group</div>
                      <div style={{ fontFamily: theme.fonts.names, fontSize: 16, fontWeight: 600, color: '#1a2a38' }}>{g.group}</div>
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 17, color: theme.textSoft, paddingTop: 16, borderTop: '1px solid rgba(90,136,168,0.14)', lineHeight: 1.7 }}>
                  We can't wait to celebrate with you!
                </div>
              </div>
            </div>
          );
        })()}

        {/* Multiple results list */}
        {status === 'results' && results.length > 1 && !selected && (
          <div style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.textSoft, textAlign: 'center', marginBottom: 14, letterSpacing: '0.04em' }}>
              {results.length} guests found — tap your name
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map((g, i) => (
                <button key={i} onClick={() => setSelected(g)} style={{
                  background: 'linear-gradient(160deg, #ffffff 0%, #eef5fb 100%)',
                  border: '1.5px solid rgba(90,136,168,0.20)',
                  borderRadius: 16,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 4px 14px rgba(60,100,140,0.09)',
                  animation: 'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                  animationDelay: `${i * 0.06}s`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  justifyContent: 'space-between',
                  transition: 'transform 160ms cubic-bezier(0.22,1,0.36,1), box-shadow 160ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(60,100,140,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(60,100,140,0.09)'; }}
                >
                  <span style={{ fontFamily: theme.fonts.names, fontSize: 17, color: '#1a2a38' }}>{g.name}</span>
                  <span style={{ fontFamily: theme.fonts.body, fontSize: 15, color: '#5a7a90', flexShrink: 0 }}>Table {getTable(g)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No result */}
        {status === 'none' && (
          <div style={{
            background: '#ffffff',
            border: '1.5px dashed rgba(90,136,168,0.35)',
            borderRadius: 18,
            padding: '28px 24px',
            textAlign: 'center',
            animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
            boxShadow: '0 4px 16px rgba(60,100,140,0.06)',
          }}>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 15, color: '#4a5a6a', lineHeight: 1.7 }}>
              We couldn't find your name.<br />
              Please check the spelling or visit the welcome desk.
            </div>
          </div>
        )}
      </div>

      {/* Divider before full table listing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '40px auto 0', maxWidth: 480, opacity: 0.45 }}>
        <div style={{ flex: 1, height: 1, background: theme.dustyBlue }} />
        <div style={{ fontFamily: theme.fonts.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.dustyBlue }}>All Tables</div>
        <div style={{ flex: 1, height: 1, background: theme.dustyBlue }} />
      </div>
    </div>
  );
}

function SeatingPlanPage({ guests, onBack }) {
  const grouped = useMemo(() => {
    const map = {};
    guests.forEach(g => {
      let t = g.table;
      if (!t) {
        const grp = (g.group || '').toLowerCase();
        t = (grp === 'bride' || grp === 'groom') ? 'Sweetheart' : 'Unassigned';
      }
      if (!map[t]) map[t] = [];
      map[t].push(g);
    });
    const ordered = Object.entries(map).sort((a, b) => {
      if (a[0] === 'Sweetheart') return -1;
      if (b[0] === 'Sweetheart') return 1;
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
    <>
      <div style={{ padding: '20px 20px 0' }}>
        <BackLink onBack={onBack} />
      </div>
      <Section>
        <SectionHeader overline="Seating" title="Seating Plan" />
        <SeatingFinder guests={guests} />
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
              background: 'rgba(255,255,255,0.85)',
              animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.1 + i * 0.07}s`,
              transition: 'transform 240ms cubic-bezier(0.23,1,0.32,1), box-shadow 240ms ease-out'
            }}
          >
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: theme.dustyBlue,
              marginBottom: 4
            }}>
              Table
            </div>
            <div style={{ fontFamily: theme.fonts.title, fontSize: 32, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
              {table}
            </div>
            <div style={{ height: 1, background: theme.divider, margin: '0 0 14px' }} />
            {list.map((g, j) => (
              <div key={j} style={{
                fontFamily: theme.fonts.body,
                fontSize: 16,
                fontWeight: 600,
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
    </>
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
    : 'linear-gradient(160deg, #ddeef6 0%, #e8f2f8 55%, #f0f7fc 100%)';

  const goHome = () => setPage('home');

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <ScrollDownIndicator />
      <GlobalStyles />
      <Header onNavigate={setPage} current={page} />

      <FadeInPage key={page}>
        {page === 'home' && (
          <>
            <Hero content={content} />
            <div style={{ background: 'linear-gradient(180deg, #c0d8ec 0%, #cce0f0 100%)' }}>
              <FindYourSeat guests={guests} />
            </div>
            <div style={{ background: 'linear-gradient(180deg, #cce0f0 0%, #ddeef6 100%)' }}>
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
