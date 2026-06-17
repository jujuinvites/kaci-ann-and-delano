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
    `}</style>
  );
}

/* Wraps page content — re-mounts on navigation to replay animation */
const FadeInPage = ({ children, style }) => (
  <div style={{ animation: 'fadeInUp 0.55s cubic-bezier(0.22,1,0.36,1) both', ...style }}>
    {children}
  </div>
);

/* =============================================================
   THEME
   ============================================================= */
const theme = {
  dustyBlue: '#6b8fa8',
  cream: '#FAF8F4',
  beigeBg: '#EDE7E2',
  pageBg: '#FAF8F4',
  cardBg: '#ffffff',
  cardShadow: '0 4px 20px rgba(80,110,140,0.10)',
  text: '#2d3a4a',
  textSoft: '#6b7a8a',
  divider: 'rgba(107,143,168,0.18)',

  fonts: {
    script: "'Great Vibes', cursive",
    title: "'Playfair Display', serif",
    body: "'Raleway', sans-serif"
  },

  images: {
    logoImage: '/images/logo.png',
    namesImage: '/images/names.png',
    flowersImage: '/images/flowers.png',
    coupleBannerImage: '/images/couple-banner.png'
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
    { role: 'Matron of Honour', names: ['Mrs Kendra Simpson'] },
    { role: 'Bridesmaid', names: ["Ms K'Fian Russell"] },
    { role: 'Best Man', names: ['Mr Alex Russell'] },
    { role: 'Groomsman', names: ['Mr Jamoy Anguin'] },
    { role: 'Officiant', names: ['Bishop Vernon Morrison'] },
    { role: 'Flower Girls', names: ["Khalian Russell", "K'Drian Russell"] },
    { role: 'Ring Bearer', names: ['Mykal Russell'] }
  ]
};

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

const SoftCard = ({ children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: theme.cardBg,
      borderRadius: 18,
      boxShadow: theme.cardShadow,
      padding: 24,
      transition: 'transform 220ms ease, box-shadow 220ms ease',
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
      border: 'none',
      color: theme.dustyBlue,
      fontFamily: theme.fonts.body,
      fontSize: 12,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 18,
      padding: 0,
      cursor: 'pointer',
      animation: 'fadeIn 0.4s ease both'
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
  { id: 'programme', label: 'Wedding Programme' },
  { id: 'menu', label: 'Menu' },
  { id: 'bridal', label: 'Bridal Party' },
  { id: 'seating', label: 'Seating Plan' },
  { id: 'love', label: 'Love & Wisdom' }
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
        background: 'rgba(250,248,244,0.92)',
        borderBottom: `1px solid ${theme.divider}`,
        transition: 'box-shadow 300ms ease'
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
              style={{ height: 52, width: 52, objectFit: 'contain', transition: 'transform 300ms ease' }}
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
            background: '#fff',
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
                  onMouseEnter={e => { if (current !== item.id) e.currentTarget.style.background = 'rgba(107,143,168,0.05)'; }}
                  onMouseLeave={e => { if (current !== item.id) e.currentTarget.style.background = 'transparent'; }}
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
      background: 'linear-gradient(160deg, #b8d4e8 0%, #c9dfee 30%, #dce8f0 65%, #e8dfd8 100%)',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '72px 24px 48px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{
          fontFamily: theme.fonts.body,
          fontSize: 15,
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
            mixBlendMode: 'screen',
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
        src={theme.images.flowersImage}
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
            border: `1px solid ${theme.divider}`,
            background: theme.cardBg,
            fontSize: 15,
            outline: 'none',
            color: theme.text,
            boxShadow: theme.cardShadow,
            transition: 'box-shadow 200ms ease, border-color 200ms ease'
          }}
          onFocus={e => { e.currentTarget.style.borderColor = theme.dustyBlue; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107,143,168,0.15)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = theme.divider; e.currentTarget.style.boxShadow = theme.cardShadow; }}
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
            background: `linear-gradient(180deg, #fff, ${theme.beigeBg})`,
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
    id: 'programme', title: 'Wedding Programme',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
  {
    id: 'menu', title: 'Menu',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
  },
  {
    id: 'bridal', title: 'Bridal Party',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  {
    id: 'love', title: 'Love & Wisdom',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>
  },
  {
    id: 'seating', title: 'Seating Plan',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
  }
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
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: 18,
              boxShadow: theme.cardShadow,
              padding: '32px 20px',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms ease',
              animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.05 + i * 0.07}s`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 14px 32px rgba(80,110,140,0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = theme.cardShadow;
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
              fontSize: 15,
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
      background: 'linear-gradient(175deg, #d6e8f3 0%, #e6dfd8 55%, #f1ece7 100%)',
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
                background: 'rgba(242, 236, 229, 0.62)',
                borderRadius: 20,
                padding: '22px 24px',
                boxShadow: '0 2px 18px rgba(107,143,168,0.07)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 18,
                animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay: `${0.35 + i * 0.1}s`,
                transition: 'transform 250ms ease, box-shadow 250ms ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(107,143,168,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 18px rgba(107,143,168,0.07)'; }}
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
              fontSize: 14,
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
   PAGE: WEDDING PROGRAMME
   ============================================================= */
function WeddingProgrammePage({ onBack }) {
  const sections = [
    {
      title: 'Ceremony',
      items: [
        'Processional',
        'Musical Prelude',
        'Seating of Family & Guests',
        "Entrance: Groom's Parents, Bride & Groom Grandparents, Bridal Party, Ring Bearer, Flower Girls",
        "Bride's Entrance",
        'Opening Song',
        'Officiant: Bishop Vernon Morrison',
        'Invocation: Rev Deloris Trowers',
        'Welcome',
        'Scripture Readings: Mr Adrian Huntley & Ms Shelian Samuels',
        'Officiant Address to Couple',
        'Exchange of Vows & Rings',
        'Signing of Registry — Special Item: Ministry of Song by Sis Shanique Davis',
        'Unity Ceremony: Sand Ceremony',
        'Blessings / Prayer for Couple',
        'Pronouncement',
        'Recessional'
      ]
    },
    {
      title: 'Cocktail Hour',
      items: [
        'Refreshments, Water & Juice',
        'Dominoes',
        'Jumbo Jenga',
        'DJ Entertainment',
        'Wedding Mirror'
      ]
    },
    {
      title: 'Reception',
      items: [
        "MC / Director of Program: Bishop Marlon O'Leslie",
        'Invitation to Dinner',
        'Seating of Guests',
        'Bridal Party Entrance',
        'Newly Wed Entrance',
        'First Dance: Newly Weds',
        'Blessing of Meal & Cake: Sis Mavis Bailey',
        'Serving of Dishes',
        'Toast / Speeches',
        'Unveiling of Cake: Mothers of Couple',
        'Cutting & Feeding of Cake',
        'Games: Shoe Couples, Removing of Garter, Tossing of Bouquet & Garter',
        'Dessert & Wedding Favour Handouts',
        'Send Off'
      ]
    }
  ];

  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader overline="Order of the Day" title="Wedding Programme" />
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {sections.map((sec, i) => (
          <div
            key={i}
            style={{
              marginBottom: 48,
              animation: 'fadeInUp 0.5s ease both',
              animationDelay: `${0.1 + i * 0.12}s`
            }}
          >
            <div style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: theme.dustyBlue,
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {sec.title}
            </div>
            <div style={{ width: 32, height: 1, margin: '0 auto 20px', background: theme.divider }} />
            {sec.items.map((item, j) => (
              <div key={j} style={{
                fontFamily: theme.fonts.body,
                fontSize: 15,
                color: theme.text,
                padding: '10px 0',
                borderBottom: j < sec.items.length - 1 ? `1px solid ${theme.divider}` : 'none',
                lineHeight: 1.6,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}>
                <span style={{ color: theme.dustyBlue, opacity: 0.55, fontSize: 9, marginTop: 5, flexShrink: 0 }}>◆</span>
                <span>{item}</span>
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
            style={{
              background: 'rgba(255,255,255,0.85)',
              animation: 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.1 + i * 0.07}s`,
              transition: 'transform 240ms ease, box-shadow 240ms ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(80,110,140,0.16)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.cardShadow; }}
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
    : 'linear-gradient(160deg, #dce8f3 0%, #e8e3de 55%, #f3efe9 100%)';

  const goHome = () => setPage('home');

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <GlobalStyles />
      <Header onNavigate={setPage} current={page} />

      <FadeInPage key={page}>
        {page === 'home' && (
          <>
            <Hero content={content} />
            <div style={{ background: 'linear-gradient(180deg, #d4e6f1 0%, #dde7ef 100%)' }}>
              <FindYourSeat guests={guests} />
            </div>
            <div style={{ background: 'linear-gradient(180deg, #dde7ef 0%, #e8e3de 100%)' }}>
              <ExploreGrid onNavigate={setPage} />
            </div>
          </>
        )}

        {page === 'timeline' && <TimelinePage content={content} onBack={goHome} />}
        {page === 'programme' && <WeddingProgrammePage onBack={goHome} />}
        {page === 'menu' && <MenuPage content={content} onBack={goHome} />}
        {page === 'love' && <LoveWisdomPage onBack={goHome} />}
        {page === 'bridal' && <BridalPartyPage bridal={bridal} onBack={goHome} />}
        {page === 'seating' && <SeatingPlanPage guests={guests} onBack={goHome} />}
      </FadeInPage>

      <Footer />
    </div>
  );
}
