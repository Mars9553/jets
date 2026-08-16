export type EventStatus = 'upcoming' | 'past' | 'ongoing';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  venue: string;
  status: EventStatus;
  category: string;
  image: string;
  gallery: string[];
  highlights: string[];
  organizer: string;
  likes: number;
  liked: boolean;
  attending: number;
  userAttending: boolean;
}

const PEXELS = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=800&q=80`;

export const EVENTS: CampusEvent[] = [
  {
    id: '1',
    title: '14th Rivers State University (RSU) SUG Week 2026',
    shortDescription:
      'A week-long celebration of student life themed "Boundless Potentials", featuring parades, cultural displays, food festivals, and award nights across RSU campus.',
    description:
      'The 14th Rivers State University (RSU) SUG Week 2026 returns with the theme "Boundless Potentials" — a six-day celebration of student life, culture, and creativity.\n\nEvent Schedule Breakdown:\n• 14th June: SUG Week Flag-Off\n• 15th June: Praise Eve\n• 16th June: Vice-Chancellor/Students Parade & Color Festival\n• 17th June: Costume Day\n• 18th June: Food & Bole Festival\n• 19th June: Rag Day, Pageantry, Dinner & Award Night\n• 20th June: Cultural Day\n• 21st June: Thanksgiving Service\n\nJoin students, faculty, and guests for a vibrant week of music, food, traditional performances, and community spirit at RSU.',
    date: 'Jun 15 - Jun 20, 2026',
    time: '08:00 AM – 10:00 PM',
    venue: 'RSU Main Campus & Port Harcourt',
    status: 'upcoming',
    category: 'Social',
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_2.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_3.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_4.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_5.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_6.jpg',
    ],
    highlights: [
      'SUG Week Flag-Off',
      'Praise Eve',
      'VC/Students Parade & Color Festival',
      'Costume Day',
      'Food & Bole Festival',
      'Rag Day & Pageantry',
      'Dinner & Award Night',
      'Cultural Day',
      'Thanksgiving Service',
    ],
    organizer: 'Students Union Government (SUG)',
    likes: 120,
    liked: false,
    attending: 850,
    userAttending: false,
  },
  {
    id: '2',
    title: '136th Inaugural Lecture of Rivers State University',
    shortDescription:
      '136th Inaugural Lecture at RSU on effective valuation and property investment governance.',
    description:
      'Rivers State University, Nkpolu-Oroworukwo, Port Harcourt, on Wednesday 29th July, 2026, hosted its 136th Inaugural Lecture, where Professor of Property Investment and Valuation, Prof. Chukwuemeka Edmund Ekenta, declared that effective valuation is the foundation of sustainable property investment and good governance in Nigeria.\n\nDelivering the lecture titled "Valuation as the Fulcrum of Property Investments and Systemic Governance: Inquests from Scholarship"',
    date: 'Jul 17, 2026',
    time: '10:00 AM \u2013 12:00 PM',
    venue: 'Senate Chamber, Admin Block',
    status: 'past',
    category: 'Academic',
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/inauguration/Inauguration_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/inauguration/Inauguration_2.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/inauguration/Inauguration_3.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/inauguration/Inauguration_4.jpg',
    ],
    highlights: ['Inaugural lecture', 'Faculty procession', 'Light reception', 'Guest speakers'],
    organizer: 'Office of the Vice-Chancellor',
    likes: 12,
    liked: false,
    attending: 45,
    userAttending: false,
  },
  {
    id: '3',
    title: 'Korean Universe Festival',
    shortDescription:
      'Enjoying Korean culture in Port Harcourt.',
    description:
      'The Korean Universe Festival in Port Harcourt features K-pop, K-drama, food, and games. Additionally, the local Korean snack vendor TheSkyBrand is appearing at the rescheduled Bole Festival 2026 (Power of X).\n\nEvent Details\nKorean Universe Festival: Held previously on August 14, 2026, from 11:00 AM to 08:00 PM WAT at Tontex Garden, Port Harcourt.\n\nBole Festival 2026 (Featuring Korean Vendors):\nNew Dates: September 4th, 5th, and 6th, 2026 (rescheduled from late August).\nLocation: Yakubu Gowon Stadium, Port Harcourt, Rivers State, Nigeria.\nKorean Highlight: TheSkyBrand is hosting a pop-up Korean convenience store experience with K-pop and K-drama themes, plus Korean snacks.',
    date: 'Oct 10, 2026',
    time: '10:00 AM',
    venue: 'Tontex Garden, Port Harcourt',
    status: 'upcoming',
    category: 'Social',
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/korean_festival/korean_festival_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/korean_festival/korean_festival_1.jpg',
    ],
    highlights: ['Kpop Singing competition', 'Kpop dancing Competiotion', 'Kdrama Viewing', 'DIY Ramen Booth', 'Kanbok Fashion Show', 'Korean Food/snaks,m', 'Korean Language consult', 'And many more'],
    organizer: 'Cultural Affairs Unit',
    likes: 0,
    liked: false,
    attending: 0,
    userAttending: false,
  },
  {
    id: '4',
    title: 'Global South Index Buildathon 2026',
    shortDescription:
      'A collaborative buildathon bringing together students to create data tools, visualizations, and policy prototypes for Global South development challenges.',
    description:
      'The Global South Index Buildathon 2026 invites developers, researchers, and policy students to build open-source tools, dashboards, and datasets that illuminate development indicators across the Global South.\n\nOver two days, participants will work in cross-disciplinary teams to prototype index frameworks, build data visualizations, and create policy briefs addressing real-world challenges in education, healthcare, infrastructure, and economic empowerment.\n\nEvent Schedule:\n• Day 1: Keynote & team formation, dataset workshop, hackathon begins\n• Day 2: Prototype presentations, judging panel, award ceremony\n\nMentors from development agencies, tech companies, and academia will be available throughout. Participation is open to all RSU students. Prizes include internships, seed funding for promising projects, and publication opportunities.',
    date: 'Oct 20 – Oct 21, 2026',
    time: '09:00 AM – 06:00 PM',
    venue: 'IT Innovation Hub',
    status: 'upcoming',
    category: 'Technology',
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_1.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_2.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_3.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_4.jpg',
    ],
    highlights: ['Cross-disciplinary team projects', 'Mentorship from development experts', 'Open data workshops', 'Prototype showcase & awards'],
    organizer: 'Faculty of Computing & Global Development Society',
    likes: 15,
    liked: false,
    attending: 32,
    userAttending: false,
  },
  {
    id: '5',
    title: 'Tech Expo 2026',
    shortDescription:
      'Student-led demos of robotics, AI projects, mobile apps, and startup pitches from campus innovators.',
    description:
      'Explore cutting-edge projects built by students and research groups. The Tech Expo features live demos, a hackathon showcase, investor office hours, and workshops on React Native, cloud computing, and product design.',
    date: 'Jun 18, 2026',
    time: '11:00 AM \u2013 06:00 PM',
    venue: 'IT Innovation Hub',
    status: 'upcoming',
    category: 'Technology',
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/tech_expo/tech_expo_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/tech_expo/tech_expo_2.png',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/tech_expo/tech_expo_3.jpg',
    ],
    highlights: ['Live project demos', 'Startup pitches', 'Workshop sessions', 'Networking with alumni'],
    organizer: 'Faculty of Computing',
    likes: 22,
    liked: false,
    attending: 89,
    userAttending: false,
  },
  {
    id: '6',
    title: 'RSU 44th Matriculation Ceremony 2025/2026',
    shortDescription:
      'RSU inducted 5,601 new students at the 44th Matriculation Ceremony at the Convocation Arena.',
    description:
      'Rivers State University (RSU) held its 44th matriculation ceremony for the 2025/2026 academic session on Wednesday, January 28, 2026, at 9:00 a.m. at the main Convocation Arena in Nkpolu-Oroworukwo, Port Harcourt, officially inducting 5,601 fresh students.\n\nEvent and Registration Details\nDate: Wednesday, January 28, 2026\nTime: 9:00 a.m.\nVenue: University Convocation Arena, RSU, Port Harcourt',
    date: 'Jan 28, 2026',
    time: '09:00 AM \u2013 12:00 PM',
    venue: 'University Convocation Arena, RSU, Port Harcourt',
    status: 'past',
    category: 'Academic',
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/matriculation/matriculation_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/matriculation/matriculation_2.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/matriculation/matriculation_3.jpg',
    ],
    highlights: ['Matriculation oath', 'VC address', 'Faculty introductions', 'Group photo'],
    organizer: 'Registry & Academic Affairs',
    likes: 6,
    liked: false,
    attending: 200,
    userAttending: false,
  },
];

export function getEventById(id: string): CampusEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function getRelatedEvents(currentId: string, limit = 3): CampusEvent[] {
  return EVENTS.filter((e) => e.id !== currentId).slice(0, limit);
}

export function getStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'past':
      return 'Past';
    case 'ongoing':
      return 'Ongoing';
    default:
      return 'Upcoming';
  }
}
