import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

/* =============================================================
   THEME
   ============================================================= */
const theme = {
  dustyBlue: '#6b8fa8',
  cream: '#FAF8F4',
  beigeBg: '#EDE7E2',
  pageBg: '#FAF8F4',
  heroBg1: '#b8cfe2',
  heroBg2: '#d6e8f4',
  cardBg: '#ffffff',
  footerBg: '#2d3a4a',
  footerText: '#c8d8e8',
  cardShadow: '0 4px 20px rgba(80,110,140,0.10)',
  text: '#2d3a4a',
  textSoft: '#6b7a8a',
  divider: 'rgba(107,143,168,0.18)',

  fonts: {
    script: "'Great Vibes', cursive",
    title: "'Playfair Display', serif",
    body: "'Raleway', sans-serif"
  },

  // image paths (preloaded — no admin upload needed)
  images: {
    heroBgImage: '/images/hero.jpg',
    footerBgImage: '/images/footer.jpg',
    heroImage: '/images/floral.png',
    logoImage: '/images/logo.png',
    coupleBannerImage: '/images/couple-banner.png',
    namesImage: '/images/names.png',
    flowersImage: '/images/flowers.png'
  }
};

/* =============================================================
   CONSTANTS / DEFAULT CONTENT
   ============================================================= */
const DEFAULT_CONTENT = {
  couple: 'Kaci-Ann & Delano',
  date: 'Saturday, July 4, 2026',
  venueLine1: 'Little Savoy Guest House',
  venueLine2: 'Runaway Bay, St. Ann, Jamaica',
  welcomeMessage:
    'We are so grateful you are here to share in our love story. Welcome to a day made for celebrating, dancing, and quiet moments shared with those who matter most.',

  loveWisdomIntro:
    'While waiting to be served, each table is invited to take part in a fun and meaningful challenge.',

  songDedication: {
    title: 'Song Dedication',
    body: 'Identify a love song played by the DJ and either sing a short line or name the artist.'
  },
  marriageAdvice: [
    'Work together to share your best piece of advice for a happy and lasting marriage.'
  ],
  memoryLane: [
    { year: 'Activity', text: 'Share a favourite memory you have with the bride or groom.' }
  ],
  lovePrediction:
    'Predict where the couple will be in 10 years — the more creative, the better.',

  menu: [
    {
      section: 'Starters',
      items: ['Ackee & Saltfish Tartlets', 'Pumpkin Soup', 'Garden Salad with Mango Vinaigrette']
    },
    {
      section: 'Proteins',
      items: ['Jerk Chicken', 'Curried Goat', 'Grilled Snapper with Escovitch']
    },
    {
      section: 'Sides',
      items: ['Rice & Peas', 'Festival', 'Steamed Callaloo', 'Roasted Breadfruit']
    },
    {
      section: 'Sweets',
      items: ['Black Cake', 'Coconut Drops', 'Sorrel Sorbet']
    }
  ],

  timeline: [
    { time: '3:00 PM', title: 'Guest Arrival', detail: 'Welcome drinks on the terrace' },
    { time: '4:00 PM', title: 'Ceremony', detail: 'Garden lawn — please be seated by 3:45 PM' },
    { time: '5:00 PM', title: 'Cocktail Hour', detail: 'Live acoustic set & canapés' },
    { time: '6:30 PM', title: 'Reception & Dinner', detail: 'Toasts, dinner, and first dance' },
    { time: '9:00 PM', title: 'Dancing', detail: 'The party begins — dress for movement' },
    { time: '11:30 PM', title: 'Send-Off', detail: 'Sparklers under the stars' }
  ]
};

const DEFAULT_BRIDAL = {
  bridesmaids: ['Alicia Brown', 'Tameka Wright', 'Shanice Powell', 'Nadine Clarke'],
  groomsmen: ['Marcus Reid', 'Devon Campbell', 'Andre Smith', 'Kemar Walters'],
  flowerGirls: ['Aria Brown', 'Maya Reid'],
  specialRoles: [
    { role: 'Maid of Honour', name: 'Sasha Williams' },
    { role: 'Best Man', name: 'Damion Grant' },
    { role: 'Officiant', name: 'Pastor R. Bennett' },
    { role: 'Ring Bearer', name: 'Noah Campbell' }
  ]
};

const DEFAULT_GUESTS = [
  { name: 'Jane Doe', table: '1', seat: '1', group: 'Family' },
  { name: 'John Doe', table: '1', seat: '2', group: 'Family' },
  { name: 'Marcus Reid', table: '2', seat: '1', group: 'Groomsmen' },
  { name: 'Alicia Brown', table: '2', seat: '2', group: 'Bridesmaids' },
  { name: 'Pastor R. Bennett', table: '3', seat: '1', group: 'Officiant' }
];

// Replace with the real Google Apps Script web app endpoint
const GUEST_NOTES_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyZUAxo330ZmV20qUtsMw5xadmt3heQLjxWUrE0xiN40HT3VIo8lfyMBQuNZDrrE966/exec'; // e.g. 'https://script.google.com/macros/s/XXXX/exec'

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
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }
};

/* =============================================================
   Reusable styled primitives (inline-style helpers)
   ============================================================= */
const Section = ({ children, style }) => (
  <section
    style={{
      maxWidth: 880,
      margin: '0 auto',
      padding: '64px 24px',
      ...style
    }}
  >
    {children}
  </section>
);

const SectionHeader = ({ overline, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: 40 }}>
    {overline && (
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 12,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: theme.dustyBlue,
          marginBottom: 12
        }}
      >
        {overline}
      </div>
    )}
    <h2
      style={{
        fontFamily: theme.fonts.title,
        fontSize: 'clamp(28px, 5vw, 40px)',
        fontWeight: 500,
        color: theme.text,
        margin: 0,
        letterSpacing: 0.5
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 15,
          color: theme.textSoft,
          marginTop: 14,
          lineHeight: 1.6
        }}
      >
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

/* =============================================================
   HEADER / NAV
   ============================================================= */
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'timeline', label: 'Wedding Timeline' },
  { id: 'menu', label: 'Menu' },
  { id: 'bridal', label: 'Bridal Party' },
  { id: 'notes', label: 'Guest Notes' },
  { id: 'seating', label: 'Seating Plan' },
  { id: 'love', label: 'Love & Wisdom' }
];

function Header({ onNavigate, current }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(10px)',
          background: 'rgba(250,248,244,0.92)',
          borderBottom: `1px solid ${theme.divider}`
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '10px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            onClick={() => handleNav('home')}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img
              src={theme.images.logoImage}
              alt="K & D"
              style={{ height: 52, width: 52, objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
            <span style={{ display: 'block', width: 26, height: 2, background: theme.text, borderRadius: 2 }} />
            <span style={{ display: 'block', width: 26, height: 2, background: theme.text, borderRadius: 2 }} />
            <span style={{ display: 'block', width: 26, height: 2, background: theme.text, borderRadius: 2 }} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ flex: 1, background: 'rgba(0,0,0,0.35)' }}
          />
          <div
            style={{
              width: 300,
              background: '#fff',
              height: '100%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: `1px solid ${theme.divider}`
              }}
            >
              <img
                src={theme.images.logoImage}
                alt="K & D"
                style={{ height: 44, width: 44, objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${theme.divider}`,
                    padding: '18px 28px',
                    fontFamily: theme.fonts.body,
                    fontSize: 16,
                    color: theme.text,
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '20px 28px', borderTop: `1px solid ${theme.divider}` }}>
              <button
                onClick={() => handleNav(current === 'admin' ? 'home' : 'admin')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontFamily: theme.fonts.body,
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: theme.textSoft,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Admin
              </button>
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
        style={{
          width: '100%',
          display: 'block',
          objectFit: 'cover',
          minHeight: 180
        }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}

/* =============================================================
   HERO
   ============================================================= */
function Hero({ content }) {
  return (
    <div style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #FAF8F4 30%, #dce8f0 100%)', textAlign: 'center', overflow: 'hidden' }}>
      <div style={{ padding: '72px 24px 48px', maxWidth: 680, margin: '0 auto' }}>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 15,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: theme.dustyBlue,
            marginBottom: 36
          }}
        >
          Welcome to the wedding of
        </div>

        <img
          src={theme.images.namesImage}
          alt="Kaci-Ann & Delano"
          style={{ width: '88%', maxWidth: 560, display: 'block', margin: '0 auto 40px' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 22
          }}
        >
          <div style={{ height: 1, width: 56, background: theme.divider }} />
          <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
            <circle cx="11" cy="9" r="7" stroke={theme.dustyBlue} strokeWidth="1.5" fill="none" />
            <circle cx="21" cy="9" r="7" stroke={theme.dustyBlue} strokeWidth="1.5" fill="none" />
          </svg>
          <div style={{ height: 1, width: 56, background: theme.divider }} />
        </div>

        <div
          style={{
            fontFamily: theme.fonts.title,
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 700,
            color: theme.text,
            letterSpacing: 1,
            marginBottom: 10
          }}
        >
          {content.date}
        </div>

        <div
          style={{
            fontFamily: theme.fonts.title,
            fontSize: 17,
            fontStyle: 'italic',
            color: theme.textSoft,
            marginBottom: 28
          }}
        >
          {content.venueLine1}
        </div>

        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 16,
            color: theme.textSoft,
            lineHeight: 1.8,
            maxWidth: 480,
            margin: '0 auto'
          }}
        >
          {content.welcomeMessage}
        </p>
      </div>

      <img
        src={theme.images.flowersImage}
        alt=""
        aria-hidden
        style={{ width: '100%', display: 'block' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
    // tiny delay to show the loading state
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const match = guests.find((g) => (g.name || '').toLowerCase().includes(q));
      setResult(match || null);
      setLoading(false);
      setSearched(true);
    }, 450);
  };

  return (
    <Section style={{ paddingTop: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2
          style={{
            fontFamily: theme.fonts.script,
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 400,
            color: theme.text,
            margin: '0 0 8px'
          }}
        >
          Find Your Seat
        </h2>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: theme.dustyBlue
          }}
        >
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
          onChange={(e) => setQuery(e.target.value)}
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
            boxShadow: theme.cardShadow
          }}
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
            textTransform: 'uppercase'
          }}
        >
          Find My Seat
        </button>
      </form>

      <div style={{ marginTop: 28, minHeight: 80, textAlign: 'center' }}>
        {loading && (
          <div style={{ fontFamily: theme.fonts.body, color: theme.textSoft }}>
            Searching…
          </div>
        )}

        {!loading && searched && result && (
          <SoftCard
            style={{
              maxWidth: 420,
              margin: '0 auto',
              textAlign: 'center',
              background: `linear-gradient(180deg, #fff, ${theme.beigeBg})`
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: theme.dustyBlue,
                marginBottom: 8
              }}
            >
              You're seated here
            </div>
            <div style={{ fontFamily: theme.fonts.title, fontSize: 24, color: theme.text }}>
              {result.name}
            </div>
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                justifyContent: 'center',
                gap: 28,
                fontFamily: theme.fonts.body,
                fontSize: 14,
                color: theme.textSoft
              }}
            >
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
                  Table
                </div>
                <div style={{ fontSize: 22, color: theme.text, marginTop: 4 }}>
                  {result.table || '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
                  Seat
                </div>
                <div style={{ fontSize: 22, color: theme.text, marginTop: 4 }}>
                  {result.seat || '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
                  Group
                </div>
                <div style={{ fontSize: 14, color: theme.text, marginTop: 8 }}>
                  {result.group || '—'}
                </div>
              </div>
            </div>
          </SoftCard>
        )}

        {!loading && searched && !result && (
          <div style={{ fontFamily: theme.fonts.body, color: theme.textSoft }}>
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
    id: 'notes', title: 'Guest Notes',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
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
        <h2
          style={{
            fontFamily: theme.fonts.script,
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 400,
            color: theme.text,
            margin: '0 0 8px'
          }}
        >
          Explore the Day
        </h2>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: theme.dustyBlue
          }}
        >
          Tap to navigate
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          maxWidth: 880,
          margin: '0 auto'
        }}
      >
        {EXPLORE_CARDS.map((c) => (
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
              transition: 'transform 220ms ease, box-shadow 220ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(80,110,140,0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.cardShadow;
            }}
          >
            <span style={{ color: theme.dustyBlue }}>{c.icon}</span>
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 16,
                color: theme.text,
                fontWeight: 400
              }}
            >
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
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          position: 'relative',
          paddingLeft: 28
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 9,
            top: 6,
            bottom: 6,
            width: 1,
            background: theme.divider
          }}
        />
        {content.timeline.map((t, i) => (
          <div key={i} style={{ position: 'relative', padding: '14px 0 26px' }}>
            <div
              style={{
                position: 'absolute',
                left: -28,
                top: 22,
                width: 10,
                height: 10,
                borderRadius: 999,
                background: theme.dustyBlue
              }}
            />
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: theme.dustyBlue,
                marginBottom: 6
              }}
            >
              {t.time}
            </div>
            <div
              style={{
                fontFamily: theme.fonts.title,
                fontSize: 22,
                color: theme.text
              }}
            >
              {t.title}
            </div>
            {t.detail && (
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 14,
                  color: theme.textSoft,
                  marginTop: 6,
                  lineHeight: 1.7
                }}
              >
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
          <div key={i} style={{ marginBottom: 44 }}>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 11,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: theme.dustyBlue,
                marginBottom: 10
              }}
            >
              {sec.section}
            </div>
            <div
              style={{
                width: 32,
                height: 1,
                margin: '0 auto 18px',
                background: theme.divider
              }}
            />
            {sec.items.map((it, j) => (
              <div
                key={j}
                style={{
                  fontFamily: theme.fonts.title,
                  fontSize: 17,
                  color: theme.text,
                  margin: '6px 0',
                  lineHeight: 1.6
                }}
              >
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* =============================================================
   PAGE: LOVE & WISDOM
   ============================================================= */
function LoveWisdomPage({ content, onBack }) {
  const activities = [
    {
      title: 'Song Dedication',
      body: 'Identify a love song played by the DJ and either sing a short line or name the artist.'
    },
    {
      title: 'Marriage Advice',
      body: 'Work together to share your best piece of advice for a happy and lasting marriage.'
    },
    {
      title: 'Memory Lane',
      body: 'Share a favourite memory you have with the bride or groom.'
    },
    {
      title: 'Love Prediction',
      body: 'Predict where the couple will be in 10 years — the more creative, the better.'
    }
  ];

  const intro = 'While waiting to be served, each table is invited to take part in a fun and meaningful challenge.';

  return (
    <div
      style={{
        background: 'linear-gradient(175deg, #d6e8f3 0%, #e6dfd8 55%, #f1ece7 100%)',
        minHeight: '100vh',
        paddingBottom: 72
      }}
    >
      <div
        style={{
          maxWidth: 580,
          margin: '0 auto',
          padding: '48px 24px 0'
        }}
      >
        {/* Back link */}
        <BackLink onBack={onBack} />

        {/* ── Title ── */}
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: theme.fonts.script,
              fontSize: 'clamp(52px, 11vw, 76px)',
              fontWeight: 400,
              color: theme.text,
              margin: 0,
              lineHeight: 1.15
            }}
          >
            Love &amp; Wisdom
          </h1>
        </div>

        {/* ── Single ornamental divider ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 32
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 90,
              height: 1,
              background: 'rgba(107,143,168,0.35)'
            }}
          />
          <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
            <circle cx="11" cy="10" r="8" stroke={theme.dustyBlue} strokeWidth="1.2" fill="none" opacity="0.55" />
            <circle cx="23" cy="10" r="8" stroke={theme.dustyBlue} strokeWidth="1.2" fill="none" opacity="0.55" />
          </svg>
          <div
            style={{
              flex: 1,
              maxWidth: 90,
              height: 1,
              background: 'rgba(107,143,168,0.35)'
            }}
          />
        </div>

        {/* ── Subtitle ── */}
        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: theme.dustyBlue,
            lineHeight: 2,
            textAlign: 'center',
            margin: '0 auto 40px',
            maxWidth: 460
          }}
        >
          {intro}
        </p>

        {/* ── Activity cards ── */}
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
                gap: 18
              }}
            >
              {/* Number badge */}
              <div
                style={{
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
                }}
              >
                {i + 1}
              </div>

              {/* Card text */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: theme.fonts.title,
                    fontSize: 19,
                    fontWeight: 500,
                    color: theme.text,
                    marginBottom: 8,
                    letterSpacing: 0.3
                  }}
                >
                  {activity.title}
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: 14,
                    color: theme.textSoft,
                    lineHeight: 1.75
                  }}
                >
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

const Subhead = ({ children }) => (
  <div
    style={{
      fontFamily: theme.fonts.body,
      fontSize: 11,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: theme.dustyBlue,
      marginBottom: 12
    }}
  >
    {children}
  </div>
);

/* =============================================================
   PAGE: BRIDAL PARTY
   ============================================================= */
function BridalPartyPage({ bridal, onBack }) {
  const groups = [
    { key: 'bridesmaids', label: 'Bridesmaids' },
    { key: 'groomsmen', label: 'Groomsmen' },
    { key: 'flowerGirls', label: 'Flower Girls' }
  ];

  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader overline="By Our Side" title="Bridal Party" />

      {bridal.specialRoles?.length > 0 && (
        <div style={{ marginBottom: 56 }}>
          <div
            style={{
              display: 'grid',
              gap: 14,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
            }}
          >
            {bridal.specialRoles.map((r, i) => (
              <SoftCard
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '24px 18px',
                  background: `linear-gradient(180deg, #fff, ${theme.beigeBg})`
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: 11,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: theme.dustyBlue,
                    marginBottom: 8
                  }}
                >
                  {r.role}
                </div>
                <div style={{ fontFamily: theme.fonts.title, fontSize: 20, color: theme.text }}>
                  {r.name}
                </div>
              </SoftCard>
            ))}
          </div>
        </div>
      )}

      {groups.map((g) => {
        const list = bridal[g.key] || [];
        if (list.length === 0) return null;
        return (
          <div key={g.key} style={{ marginBottom: 44 }}>
            <Subhead>{g.label}</Subhead>
            <div
              style={{
                display: 'grid',
                gap: 10,
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
              }}
            >
              {list.map((name, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: 14,
                    padding: '16px 18px',
                    fontFamily: theme.fonts.title,
                    fontSize: 17,
                    color: theme.text,
                    boxShadow: theme.cardShadow
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Section>
  );
}

/* =============================================================
   PAGE: GUEST NOTES
   ============================================================= */
function GuestNotesPage({ onBack }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      if (GUEST_NOTES_ENDPOINT) {
        await fetch(GUEST_NOTES_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString()
          })
        });
      }
      // also persist locally as a fallback
      const existing = storage.get('wedding.guestNotes', []);
      existing.push({ name: name.trim(), message: message.trim(), at: Date.now() });
      storage.set('wedding.guestNotes', existing);

      setSuccess(true);
      setName('');
      setMessage('');
    } catch (err) {
      setError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = {
    width: '100%',
    padding: '14px 18px',
    border: `1px solid ${theme.divider}`,
    borderRadius: 14,
    background: theme.cardBg,
    fontSize: 15,
    color: theme.text,
    outline: 'none',
    boxShadow: theme.cardShadow,
    fontFamily: theme.fonts.body
  };

  return (
    <Section>
      <BackLink onBack={onBack} />
      <SectionHeader
        overline="Leave A Note"
        title="Guest Notes"
        subtitle="Share a wish, a memory, or a piece of advice for the newlyweds."
      />
      <form onSubmit={submit} style={{ maxWidth: 520, margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ ...fieldStyle, marginBottom: 12 }}
        />
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          style={{ ...fieldStyle, resize: 'vertical', marginBottom: 16 }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '14px 22px',
            borderRadius: 999,
            border: 'none',
            background: theme.dustyBlue,
            color: '#fff',
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            opacity: submitting ? 0.7 : 1
          }}
        >
          {submitting ? 'Sending…' : 'Send Note'}
        </button>

        {success && (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 14,
              background: 'rgba(107,143,168,0.08)',
              color: theme.dustyBlue,
              fontFamily: theme.fonts.body,
              fontSize: 14,
              textAlign: 'center'
            }}
          >
            Thank you — your note has been saved with love.
          </div>
        )}
        {error && (
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 14,
              background: 'rgba(180,80,80,0.08)',
              color: '#a34646',
              fontSize: 14,
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}
      </form>
    </Section>
  );
}

/* =============================================================
   PAGE: SEATING PLAN
   ============================================================= */
function SeatingPlanPage({ guests, onBack }) {
  const grouped = useMemo(() => {
    const map = {};
    guests.forEach((g) => {
      const t = g.table || 'Unassigned';
      if (!map[t]) map[t] = [];
      map[t].push(g);
    });
    // sort tables numerically when possible
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
      <div
        style={{
          display: 'grid',
          gap: 18,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
        }}
      >
        {grouped.map(([table, list]) => (
          <SoftCard key={table} style={{ background: 'rgba(255,255,255,0.85)' }}>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: theme.dustyBlue,
                marginBottom: 4
              }}
            >
              Table
            </div>
            <div
              style={{
                fontFamily: theme.fonts.title,
                fontSize: 28,
                color: theme.text,
                marginBottom: 14
              }}
            >
              {table}
            </div>
            <div style={{ height: 1, background: theme.divider, margin: '0 0 14px' }} />
            {list.map((g, i) => (
              <div
                key={i}
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 14,
                  color: theme.text,
                  padding: '6px 0',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>{g.name}</span>
                {g.seat && (
                  <span style={{ color: theme.textSoft, fontSize: 12 }}>seat {g.seat}</span>
                )}
              </div>
            ))}
          </SoftCard>
        ))}
      </div>
    </Section>
  );
}

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
      padding: 0
    }}
  >
    ← Back
  </button>
);

/* =============================================================
   ADMIN LOGIN
   ============================================================= */
function AdminLogin({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === 'admin') {
      onSuccess();
    } else {
      setError(true);
      setPw('');
    }
  };

  const fieldStyle = {
    width: '100%',
    padding: '14px 18px',
    border: `1px solid ${theme.divider}`,
    borderRadius: 14,
    background: '#fff',
    fontSize: 15,
    color: theme.text,
    outline: 'none',
    boxShadow: theme.cardShadow,
    fontFamily: theme.fonts.body,
    letterSpacing: 2
  };

  return (
    <Section style={{ paddingTop: 100, maxWidth: 420 }}>
      <SectionHeader overline="Restricted" title="Admin Access" />
      <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: '0 auto' }}>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Enter password"
          autoFocus
          style={{ ...fieldStyle, marginBottom: 12 }}
        />
        {error && (
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 13,
              color: '#a34646',
              marginBottom: 10,
              textAlign: 'center'
            }}
          >
            Incorrect password. Please try again.
          </div>
        )}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px 22px',
            borderRadius: 999,
            border: 'none',
            background: theme.dustyBlue,
            color: '#fff',
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          Enter
        </button>
      </form>
    </Section>
  );
}

/* =============================================================
   ADMIN PANEL
   ============================================================= */
function AdminPanel({
  guests,
  setGuests,
  bridal,
  setBridal,
  content,
  setContent
}) {
  const [tab, setTab] = useState('guests');

  return (
    <Section style={{ paddingTop: 36 }}>
      <SectionHeader overline="Behind the scenes" title="Admin Panel" />

      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 28,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {[
          { id: 'guests', label: 'Guests' },
          { id: 'bridal', label: 'Bridal' },
          { id: 'design', label: 'Design' },
          { id: 'content', label: 'Content' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              border: 'none',
              background: tab === t.id ? theme.dustyBlue : 'rgba(255,255,255,0.6)',
              color: tab === t.id ? '#fff' : theme.text,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase',
              boxShadow: tab === t.id ? theme.cardShadow : 'none'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'guests' && <GuestsAdmin guests={guests} setGuests={setGuests} />}
      {tab === 'bridal' && <BridalAdmin bridal={bridal} setBridal={setBridal} />}
      {tab === 'design' && <DesignAdmin />}
      {tab === 'content' && <ContentAdmin content={content} setContent={setContent} />}
    </Section>
  );
}

/* ---------- Guests admin (with CSV import) ---------- */
function GuestsAdmin({ guests, setGuests }) {
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState({ name: '', table: '', seat: '', group: '' });
  const [editIndex, setEditIndex] = useState(-1);
  const [csvText, setCsvText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((g) =>
      Object.values(g).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [guests, search]);

  const saveDraft = () => {
    if (!draft.name.trim()) return;
    if (editIndex >= 0) {
      const updated = [...guests];
      updated[editIndex] = draft;
      setGuests(updated);
      setEditIndex(-1);
    } else {
      setGuests([...guests, draft]);
    }
    setDraft({ name: '', table: '', seat: '', group: '' });
  };

  const editRow = (i) => {
    setDraft(guests[i]);
    setEditIndex(i);
  };

  const removeRow = (i) => {
    const updated = guests.filter((_, idx) => idx !== i);
    setGuests(updated);
    if (editIndex === i) {
      setEditIndex(-1);
      setDraft({ name: '', table: '', seat: '', group: '' });
    }
  };

  /* ---- CSV import helpers ---- */
  const importCSV = useCallback(() => {
    if (!csvText.trim()) {
      setImportMessage('Please paste CSV or upload a file.');
      return;
    }
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const idx = {
      name: header.indexOf('name'),
      table: header.indexOf('table'),
      seat: header.indexOf('seat'),
      group: header.indexOf('group')
    };
    const rows = lines.slice(1).map((l) => {
      const cells = l.split(',').map((c) => c.trim());
      return {
        name: idx.name >= 0 ? cells[idx.name] || '' : cells[0] || '',
        table: idx.table >= 0 ? cells[idx.table] || '' : cells[1] || '',
        seat: idx.seat >= 0 ? cells[idx.seat] || '' : cells[2] || '',
        group: idx.group >= 0 ? cells[idx.group] || '' : cells[3] || ''
      };
    }).filter((r) => r.name);

    const newGuests = [...guests, ...rows];
    setGuests(newGuests);
    storage.set('wedding.guests', newGuests);
    setImportMessage(`Imported ${rows.length} guests.`);
    setCsvText('');
  }, [csvText, guests, setGuests]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const exportCSV = () => {
    const header = 'Name,Table,Seat,Group';
    const lines = guests.map((g) =>
      [g.name, g.table, g.seat, g.group].map((v) => String(v ?? '')).join(',')
    );
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fieldStyle = {
    padding: '10px 14px',
    border: `1px solid ${theme.divider}`,
    borderRadius: 10,
    fontSize: 14,
    background: '#fff',
    color: theme.text,
    outline: 'none',
    minWidth: 0
  };

  return (
    <div>
      {/* Add / edit row */}
      <SoftCard style={{ marginBottom: 24 }}>
        <Subhead>{editIndex >= 0 ? 'Edit Guest' : 'Add Guest'}</Subhead>
        <div
          style={{
            display: 'grid',
            gap: 10,
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))'
          }}
        >
          <input
            placeholder="Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            style={fieldStyle}
          />
          <input
            placeholder="Table"
            value={draft.table}
            onChange={(e) => setDraft({ ...draft, table: e.target.value })}
            style={fieldStyle}
          />
          <input
            placeholder="Seat"
            value={draft.seat}
            onChange={(e) => setDraft({ ...draft, seat: e.target.value })}
            style={fieldStyle}
          />
          <input
            placeholder="Group"
            value={draft.group}
            onChange={(e) => setDraft({ ...draft, group: e.target.value })}
            style={fieldStyle}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            onClick={saveDraft}
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              border: 'none',
              background: theme.dustyBlue,
              color: '#fff',
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}
          >
            {editIndex >= 0 ? 'Save Changes' : 'Add Guest'}
          </button>
          {editIndex >= 0 && (
            <button
              onClick={() => {
                setEditIndex(-1);
                setDraft({ name: '', table: '', seat: '', group: '' });
              }}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                border: `1px solid ${theme.divider}`,
                background: 'transparent',
                color: theme.text,
                fontSize: 12,
                letterSpacing: 2,
                textTransform: 'uppercase'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </SoftCard>

      {/* CSV Import */}
      <SoftCard style={{ marginBottom: 24 }}>
        <Subhead>CSV Import</Subhead>
        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 13,
            color: theme.textSoft,
            margin: '0 0 14px',
            lineHeight: 1.6
          }}
        >
          Format: <code>Name,Table,Seat,Group</code>
        </p>

        {/* Drag & drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? theme.dustyBlue : theme.divider}`,
            borderRadius: 16,
            padding: '28px 18px',
            textAlign: 'center',
            background: dragOver ? 'rgba(107,143,168,0.08)' : theme.beigeBg,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            marginBottom: 14
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              color: theme.text,
              marginBottom: 4
            }}
          >
            Drag &amp; drop CSV file here
          </div>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.textSoft }}>
            or click to upload
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        <textarea
          rows={5}
          placeholder={'Name,Table,Seat,Group\nJane Doe,1,1,Family'}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 12,
            border: `1px solid ${theme.divider}`,
            background: '#fff',
            color: theme.text,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 13,
            outline: 'none',
            resize: 'vertical'
          }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            onClick={importCSV}
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              border: 'none',
              background: theme.dustyBlue,
              color: '#fff',
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}
          >
            Import CSV
          </button>
          <button
            onClick={exportCSV}
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              border: `1px solid ${theme.divider}`,
              background: 'transparent',
              color: theme.text,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}
          >
            Export CSV
          </button>
          {importMessage && (
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 13,
                color: theme.dustyBlue,
                alignSelf: 'center'
              }}
            >
              {importMessage}
            </div>
          )}
        </div>
      </SoftCard>

      {/* Guest list */}
      <SoftCard>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          <Subhead>Guests ({guests.length})</Subhead>
          <input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...fieldStyle, minWidth: 180 }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: theme.fonts.body,
              fontSize: 14
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left', color: theme.textSoft }}>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                  Name
                </th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                  Table
                </th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                  Seat
                </th>
                <th style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                  Group
                </th>
                <th
                  style={{
                    padding: '10px 8px',
                    borderBottom: `1px solid ${theme.divider}`,
                    textAlign: 'right'
                  }}
                />
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => {
                const realIndex = guests.indexOf(g);
                return (
                  <tr key={i}>
                    <td style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                      {g.name}
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                      {g.table}
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                      {g.seat}
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: `1px solid ${theme.divider}` }}>
                      {g.group}
                    </td>
                    <td
                      style={{
                        padding: '10px 8px',
                        borderBottom: `1px solid ${theme.divider}`,
                        textAlign: 'right',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <button
                        onClick={() => editRow(realIndex)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: theme.dustyBlue,
                          fontSize: 12,
                          letterSpacing: 1.5,
                          textTransform: 'uppercase',
                          marginRight: 8
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeRow(realIndex)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#a34646',
                          fontSize: 12,
                          letterSpacing: 1.5,
                          textTransform: 'uppercase'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 20,
                      textAlign: 'center',
                      color: theme.textSoft,
                      fontStyle: 'italic'
                    }}
                  >
                    No guests yet — add one above or import a CSV.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SoftCard>
    </div>
  );
}

/* ---------- Bridal admin ---------- */
function BridalAdmin({ bridal, setBridal }) {
  const updateList = (key, value) => {
    const arr = value.split('\n').map((s) => s.trim()).filter(Boolean);
    setBridal({ ...bridal, [key]: arr });
  };

  const updateSpecial = (i, field, value) => {
    const arr = [...(bridal.specialRoles || [])];
    arr[i] = { ...arr[i], [field]: value };
    setBridal({ ...bridal, specialRoles: arr });
  };

  const addSpecial = () => {
    setBridal({
      ...bridal,
      specialRoles: [...(bridal.specialRoles || []), { role: '', name: '' }]
    });
  };

  const removeSpecial = (i) => {
    const arr = (bridal.specialRoles || []).filter((_, idx) => idx !== i);
    setBridal({ ...bridal, specialRoles: arr });
  };

  const fieldStyle = {
    padding: '10px 14px',
    border: `1px solid ${theme.divider}`,
    borderRadius: 10,
    fontSize: 14,
    background: '#fff',
    color: theme.text,
    outline: 'none',
    width: '100%'
  };

  const Group = ({ k, label }) => (
    <div style={{ marginBottom: 18 }}>
      <Subhead>{label}</Subhead>
      <textarea
        rows={4}
        value={(bridal[k] || []).join('\n')}
        onChange={(e) => updateList(k, e.target.value)}
        placeholder="One name per line"
        style={{ ...fieldStyle, resize: 'vertical' }}
      />
    </div>
  );

  return (
    <SoftCard>
      <Group k="bridesmaids" label="Bridesmaids" />
      <Group k="groomsmen" label="Groomsmen" />
      <Group k="flowerGirls" label="Flower Girls" />

      <div>
        <Subhead>Special Roles</Subhead>
        {(bridal.specialRoles || []).map((r, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gap: 10,
              gridTemplateColumns: '1fr 1fr auto',
              marginBottom: 10
            }}
          >
            <input
              placeholder="Role"
              value={r.role}
              onChange={(e) => updateSpecial(i, 'role', e.target.value)}
              style={fieldStyle}
            />
            <input
              placeholder="Name"
              value={r.name}
              onChange={(e) => updateSpecial(i, 'name', e.target.value)}
              style={fieldStyle}
            />
            <button
              onClick={() => removeSpecial(i)}
              style={{
                background: 'transparent',
                border: `1px solid ${theme.divider}`,
                borderRadius: 10,
                padding: '0 14px',
                color: '#a34646',
                fontSize: 12,
                letterSpacing: 1.5,
                textTransform: 'uppercase'
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addSpecial}
          style={{
            padding: '10px 18px',
            borderRadius: 999,
            border: 'none',
            background: theme.dustyBlue,
            color: '#fff',
            fontSize: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginTop: 6
          }}
        >
          Add Role
        </button>
      </div>
    </SoftCard>
  );
}

/* ---------- Design admin ---------- */
function DesignAdmin() {
  return (
    <SoftCard>
      <Subhead>Design</Subhead>
      <p
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 14,
          color: theme.textSoft,
          lineHeight: 1.7,
          margin: 0
        }}
      >
        Colors, fonts, and image paths are defined in the <code>theme</code> object in
        <code> src/App.jsx</code>. Replace the files in
        <code> public/images/</code> to override hero, footer, floral, or logo without
        any code changes.
      </p>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          marginTop: 18
        }}
      >
        {[
          { label: 'Dusty Blue', hex: theme.dustyBlue },
          { label: 'Cream', hex: theme.cream },
          { label: 'Beige', hex: theme.beigeBg },
          { label: 'Footer', hex: theme.footerBg }
        ].map((c) => (
          <div
            key={c.label}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: theme.cardShadow
            }}
          >
            <div style={{ height: 50, background: c.hex }} />
            <div style={{ padding: '10px 12px', background: '#fff' }}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.text }}>
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 11,
                  color: theme.textSoft
                }}
              >
                {c.hex}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SoftCard>
  );
}

/* ---------- Content admin ---------- */
function ContentAdmin({ content, setContent }) {
  const fieldStyle = {
    padding: '10px 14px',
    border: `1px solid ${theme.divider}`,
    borderRadius: 10,
    fontSize: 14,
    background: '#fff',
    color: theme.text,
    outline: 'none',
    width: '100%'
  };

  return (
    <SoftCard>
      <Subhead>Headline</Subhead>
      <input
        value={content.couple}
        onChange={(e) => setContent({ ...content, couple: e.target.value })}
        style={{ ...fieldStyle, marginBottom: 12 }}
      />
      <input
        value={content.date}
        onChange={(e) => setContent({ ...content, date: e.target.value })}
        style={{ ...fieldStyle, marginBottom: 12 }}
      />
      <input
        value={content.venueLine1}
        onChange={(e) => setContent({ ...content, venueLine1: e.target.value })}
        style={{ ...fieldStyle, marginBottom: 12 }}
      />
      <input
        value={content.venueLine2}
        onChange={(e) => setContent({ ...content, venueLine2: e.target.value })}
        style={{ ...fieldStyle, marginBottom: 18 }}
      />

      <Subhead>Welcome Message</Subhead>
      <textarea
        rows={4}
        value={content.welcomeMessage}
        onChange={(e) => setContent({ ...content, welcomeMessage: e.target.value })}
        style={{ ...fieldStyle, resize: 'vertical', marginBottom: 18 }}
      />

      <Subhead>Love Prediction</Subhead>
      <textarea
        rows={3}
        value={content.lovePrediction}
        onChange={(e) => setContent({ ...content, lovePrediction: e.target.value })}
        style={{ ...fieldStyle, resize: 'vertical' }}
      />
    </SoftCard>
  );
}

/* =============================================================
   APP ROOT
   ============================================================= */
export default function App() {
  const [page, setPage] = useState('home');
  const [adminAuth, setAdminAuth] = useState(false);

  // persisted state
  const [guests, setGuests] = useState(() =>
    storage.get('wedding.guests', DEFAULT_GUESTS)
  );
  const [bridal, setBridal] = useState(() =>
    storage.get('wedding.bridal', DEFAULT_BRIDAL)
  );
  const [content, setContent] = useState(() =>
    storage.get('wedding.content', DEFAULT_CONTENT)
  );

  useEffect(() => storage.set('wedding.guests', guests), [guests]);
  useEffect(() => storage.set('wedding.bridal', bridal), [bridal]);
  useEffect(() => storage.set('wedding.content', content), [content]);

  // scroll to top on page change; reset auth when leaving admin
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page !== 'admin') setAdminAuth(false);
  }, [page]);

  const goHome = () => setPage('home');

  return (
    <div style={{ background: theme.pageBg, minHeight: '100vh' }}>
      <Header onNavigate={setPage} current={page} />

      {page === 'home' && (
        <>
          <Hero content={content} />
          <div style={{ background: '#dce8f0' }}>
            <FindYourSeat guests={guests} />
          </div>
          <div style={{ background: '#e4edf4' }}>
            <ExploreGrid onNavigate={setPage} />
          </div>
        </>
      )}

      {page === 'timeline' && <TimelinePage content={content} onBack={goHome} />}
      {page === 'menu' && <MenuPage content={content} onBack={goHome} />}
      {page === 'love' && <LoveWisdomPage content={content} onBack={goHome} />}
      {page === 'bridal' && <BridalPartyPage bridal={bridal} onBack={goHome} />}
      {page === 'notes' && <GuestNotesPage onBack={goHome} />}
      {page === 'seating' && <SeatingPlanPage guests={guests} onBack={goHome} />}

      {page === 'admin' && (
        adminAuth ? (
          <AdminPanel
            guests={guests}
            setGuests={setGuests}
            bridal={bridal}
            setBridal={setBridal}
            content={content}
            setContent={setContent}
          />
        ) : (
          <AdminLogin onSuccess={() => setAdminAuth(true)} />
        )
      )}

      <Footer />
    </div>
  );
}
