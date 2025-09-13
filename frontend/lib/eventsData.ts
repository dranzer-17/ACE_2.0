export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'hackathon' | 'seminar' | 'workshop' | 'conference' | 'cultural' | 'sports' | 'academic';
  category: 'tech' | 'business' | 'cultural' | 'sports' | 'academic';
  organizer: string;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  image?: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isFeatured: boolean;
  prizes?: string;
  sponsors?: string[];
}

export const eventsData: Event[] = [
  {
    id: '1',
    title: 'Mumbai Tech Hackathon 2024',
    description: 'A 48-hour intensive hackathon focusing on innovative solutions for urban challenges in Mumbai. Participants will work in teams to create tech solutions addressing transportation, waste management, and digital governance.',
    date: '2024-02-15',
    time: '09:00',
    location: 'MPSTME Auditorium',
    type: 'hackathon',
    category: 'tech',
    organizer: 'ACE Committee',
    maxParticipants: 200,
    currentParticipants: 156,
    registrationRequired: true,
    registrationDeadline: '2024-02-10',
    tags: ['hackathon', 'tech', 'innovation', 'mumbai'],
    status: 'upcoming',
    isFeatured: true,
    prizes: '₹1,00,000 total prize pool',
    sponsors: ['TechCorp', 'StartupMumbai', 'InnovationHub']
  },
  {
    id: '2',
    title: 'FinTech Innovation Summit',
    description: 'Explore the latest trends in financial technology with industry experts and startup founders. Learn about blockchain, digital payments, and emerging fintech solutions.',
    date: '2024-02-20',
    time: '14:00',
    location: 'NMIMS Atrium',
    type: 'conference',
    category: 'business',
    organizer: 'Finance Department',
    maxParticipants: 150,
    currentParticipants: 89,
    registrationRequired: true,
    registrationDeadline: '2024-02-18',
    tags: ['fintech', 'blockchain', 'payments', 'startup'],
    status: 'upcoming',
    isFeatured: true,
    sponsors: ['BankTech', 'PayMumbai', 'CryptoHub']
  },
  {
    id: '3',
    title: 'AI/ML Workshop Series',
    description: 'Hands-on workshop series covering machine learning fundamentals, neural networks, and practical AI applications. Perfect for beginners and intermediate developers.',
    date: '2024-02-25',
    time: '10:00',
    location: 'Computer Lab 3',
    type: 'workshop',
    category: 'tech',
    organizer: 'CS Department',
    maxParticipants: 50,
    currentParticipants: 42,
    registrationRequired: true,
    registrationDeadline: '2024-02-22',
    tags: ['ai', 'ml', 'python', 'hands-on'],
    status: 'upcoming',
    isFeatured: false,
    sponsors: ['AITech', 'DataScienceMumbai']
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Showcase your innovative business ideas to a panel of investors and industry experts. Winners get mentorship opportunities and potential funding.',
    date: '2024-03-01',
    time: '15:00',
    location: 'Business School Auditorium',
    type: 'conference',
    category: 'business',
    organizer: 'Entrepreneurship Cell',
    maxParticipants: 25,
    currentParticipants: 18,
    registrationRequired: true,
    registrationDeadline: '2024-02-28',
    tags: ['startup', 'pitch', 'funding', 'entrepreneurship'],
    status: 'upcoming',
    isFeatured: true,
    prizes: '₹50,000 seed funding + mentorship',
    sponsors: ['VentureMumbai', 'StartupIndia', 'AngelNetwork']
  },
  {
    id: '5',
    title: 'Mumbai Heritage Tech Challenge',
    description: 'Use technology to preserve and promote Mumbai\'s rich heritage. Create digital solutions, AR experiences, or apps that showcase the city\'s history and culture.',
    date: '2024-03-10',
    time: '09:00',
    location: 'Heritage Center',
    type: 'hackathon',
    category: 'tech',
    organizer: 'Cultural Committee',
    maxParticipants: 100,
    currentParticipants: 67,
    registrationRequired: true,
    registrationDeadline: '2024-03-05',
    tags: ['heritage', 'ar', 'culture', 'mumbai'],
    status: 'upcoming',
    isFeatured: true,
    prizes: '₹75,000 + museum collaboration',
    sponsors: ['HeritageMumbai', 'TechCulture', 'MumbaiMuseum']
  },
  {
    id: '6',
    title: 'Cybersecurity Awareness Seminar',
    description: 'Learn about the latest cybersecurity threats and best practices to protect yourself and your organization. Featuring experts from leading security firms.',
    date: '2024-03-15',
    time: '11:00',
    location: 'Seminar Hall',
    type: 'seminar',
    category: 'tech',
    organizer: 'IT Security Team',
    maxParticipants: 200,
    currentParticipants: 134,
    registrationRequired: false,
    tags: ['cybersecurity', 'privacy', 'protection'],
    status: 'upcoming',
    isFeatured: false,
    sponsors: ['SecureTech', 'CyberMumbai']
  },
  {
    id: '7',
    title: 'Green Tech Innovation Challenge',
    description: 'Develop sustainable technology solutions for environmental challenges. Focus on renewable energy, waste reduction, and carbon footprint tracking.',
    date: '2024-03-20',
    time: '08:00',
    location: 'Environmental Lab',
    type: 'hackathon',
    category: 'tech',
    organizer: 'Environmental Club',
    maxParticipants: 80,
    currentParticipants: 45,
    registrationRequired: true,
    registrationDeadline: '2024-03-15',
    tags: ['green-tech', 'sustainability', 'environment'],
    status: 'upcoming',
    isFeatured: true,
    prizes: '₹60,000 + sustainability award',
    sponsors: ['GreenMumbai', 'EcoTech', 'ClimateAction']
  },
  {
    id: '8',
    title: 'Digital Marketing Masterclass',
    description: 'Learn advanced digital marketing strategies, social media optimization, and content creation techniques from industry professionals.',
    date: '2024-03-25',
    time: '13:00',
    location: 'Marketing Lab',
    type: 'workshop',
    category: 'business',
    organizer: 'Marketing Department',
    maxParticipants: 60,
    currentParticipants: 38,
    registrationRequired: true,
    registrationDeadline: '2024-03-22',
    tags: ['marketing', 'social-media', 'content', 'digital'],
    status: 'upcoming',
    isFeatured: false,
    sponsors: ['MarketMumbai', 'DigitalAgency']
  },
  {
    id: '9',
    title: 'Mumbai Smart City Hackathon',
    description: 'Build innovative solutions for Mumbai\'s smart city initiatives. Focus on traffic management, public safety, and citizen services.',
    date: '2024-04-05',
    time: '09:00',
    location: 'Smart City Lab',
    type: 'hackathon',
    category: 'tech',
    organizer: 'Smart City Initiative',
    maxParticipants: 150,
    currentParticipants: 92,
    registrationRequired: true,
    registrationDeadline: '2024-04-01',
    tags: ['smart-city', 'iot', 'urban-planning', 'mumbai'],
    status: 'upcoming',
    isFeatured: true,
    prizes: '₹2,00,000 + government collaboration',
    sponsors: ['SmartMumbai', 'GovTech', 'UrbanInnovation']
  },
  {
    id: '10',
    title: 'Women in Tech Conference',
    description: 'Celebrating women in technology with inspiring talks, networking opportunities, and career guidance from successful female tech leaders.',
    date: '2024-04-10',
    time: '10:00',
    location: 'Conference Center',
    type: 'conference',
    category: 'tech',
    organizer: 'Women in Tech Society',
    maxParticipants: 300,
    currentParticipants: 187,
    registrationRequired: true,
    registrationDeadline: '2024-04-08',
    tags: ['women-in-tech', 'diversity', 'career', 'networking'],
    status: 'upcoming',
    isFeatured: true,
    sponsors: ['TechWomen', 'DiversityMumbai', 'CareerHub']
  }
];

export const getEventsByMonth = (year: number, month: number): Event[] => {
  return eventsData.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
  });
};

export const getUpcomingEvents = (): Event[] => {
  const today = new Date();
  return eventsData
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getFeaturedEvents = (): Event[] => {
  return eventsData.filter(event => event.isFeatured);
};

export const getEventsByType = (type: Event['type']): Event[] => {
  return eventsData.filter(event => event.type === type);
};

export const getHackathons = (): Event[] => {
  return getEventsByType('hackathon');
};
