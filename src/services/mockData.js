export const mockPromotions = [
  {
    id: 'promo-jersey',
    title: '30% Off 2025 Home Jerseys',
    description: 'Rep the Golden Lions with our brand-new kit.',
    cta: 'Shop Jerseys',
    link: 'https://shop.bgfcgolenlions.com',
    imageUrl: '/promos/jersey.jpg'
  },
  {
    id: 'promo-matchday',
    title: 'Matchday Experience',
    description: 'Upgrade to the Field Club for the best gameday in BG.',
    cta: 'Upgrade Tickets',
    link: 'https://tickets.bgfc.app/experience',
    imageUrl: '/promos/fieldclub.jpg'
  },
  {
    id: 'promo-community',
    title: 'Community Night',
    description: 'Support local heroes during our annual Community Night.',
    cta: 'Learn More',
    link: 'https://bgfc.app/events/community-night',
    imageUrl: '/promos/community.jpg'
  }
];

export const mockMatches = [
  {
    id: 'match-001',
    opponent: 'Louisville United',
    opponentLogo: '/images/opponents/louisville-united.png',
    date: '2025-03-14T23:30:00Z',
    venue: 'BGFC Stadium',
    status: 'upcoming',
    competition: 'USL Championship',
    broadcast: 'BGFC+ App',
    ticketsUrl: 'https://tickets.bgfc.app/match-001',
    latitude: 36.9904,
    longitude: -86.4436,
    score: null,
    result: null
  },
  {
    id: 'match-002',
    opponent: 'Nashville Rovers',
    opponentLogo: '/images/opponents/nashville-rovers.png',
    date: '2025-03-21T23:30:00Z',
    venue: 'Nissan Field',
    status: 'upcoming',
    competition: 'USL Championship',
    broadcast: 'ESPN+',
    ticketsUrl: 'https://tickets.bgfc.app/match-002',
    latitude: 36.1667,
    longitude: -86.7833,
    score: null,
    result: null
  },
  {
    id: 'match-000',
    opponent: 'Indy Eleven',
    opponentLogo: '/images/opponents/indy-eleven.png',
    date: '2025-03-07T23:30:00Z',
    venue: 'BGFC Stadium',
    status: 'final',
    competition: 'USL Championship',
    broadcast: 'BGFC+ App',
    ticketsUrl: 'https://tickets.bgfc.app/match-000',
    latitude: 36.9904,
    longitude: -86.4436,
    score: '3-1',
    result: 'W'
  }
];

export const mockNews = [
  {
    id: 'news-001',
    title: 'Golden Lions Reveal 2025 Primary Kit',
    excerpt: 'The club introduces a bold new look inspired by Bowling Green history.',
    imageUrl: '/images/news/primary-kit.jpg',
    publishedAt: '2025-02-16T15:00:00Z',
    link: 'https://bgfc.app/news/new-kit'
  },
  {
    id: 'news-002',
    title: 'BGFC Academy Wins Regional Cup',
    excerpt: 'Future Golden Lions shine bright in weekend tournament.',
    imageUrl: '/images/news/academy.jpg',
    publishedAt: '2025-02-20T12:00:00Z',
    link: 'https://bgfc.app/news/academy'
  },
  {
    id: 'news-003',
    title: 'Season Ticket Member Events Announced',
    excerpt: 'Exclusive events lined up for loyal supporters all season long.',
    imageUrl: '/images/news/stm-events.jpg',
    publishedAt: '2025-02-22T17:00:00Z',
    link: 'https://bgfc.app/news/stm-events'
  }
];

export const mockFanZoneSections = [
  {
    id: 'theme-nights',
    title: 'Theme Nights',
    description: 'Explore our 2025 theme nights from Golden Lion Pride to Derby Day.',
    link: 'https://bgfc.app/fanzone/theme-nights'
  },
  {
    id: 'calendar',
    title: 'Add Schedule to Calendar',
    description: 'Sync the full season in one tap.',
    link: 'https://bgfc.app/calendar.ics'
  },
  {
    id: 'team-store',
    title: 'Team Store',
    description: 'Grab the latest BGFC gear at the Golden Lions Shop.',
    link: 'https://shop.bgfcgolenlions.com'
  },
  {
    id: 'pub-partners',
    title: 'Pub Partners',
    description: 'Find official pubs airing every BGFC match.',
    link: 'https://bgfc.app/fanzone/pubs'
  },
  {
    id: 'team-stats',
    title: 'Team Stats',
    description: 'Dive into goals, assists, and advanced analytics.',
    link: 'https://bgfc.app/stats'
  }
];

export const mockTicketLinks = {
  manage: 'https://bgfc.app/tickets/manage',
  single: 'https://bgfc.app/tickets/single',
  group: 'https://bgfc.app/tickets/group',
  season: 'https://bgfc.app/tickets/season',
  contact: 'https://bgfc.app/tickets/contact'
};

export const mockVoting = {
  activeMatchId: 'match-001',
  opponent: 'Louisville United',
  players: [
    { id: 'player-1', name: 'Aiden Brooks', position: 'FW', votes: 42 },
    { id: 'player-2', name: 'Mateo Ruiz', position: 'MF', votes: 35 },
    { id: 'player-3', name: 'Jordan Ellis', position: 'GK', votes: 23 }
  ]
};
