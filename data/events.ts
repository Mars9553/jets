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
}

export const EVENTS: CampusEvent[] = [
  {
    id: '1',
    title: 'SUG Week 2026',
    shortDescription:
      'A week-long celebration of student life with games, concerts, food stalls, and faculty competitions across campus.',
    description:
      'Join the Students Union Government for the biggest week of the semester. SUG Week brings together every faculty for parades, talent shows, debate finals, and nightly entertainment. All students and staff are welcome — wear your faculty colours and come ready to participate.',
    date: 'Mar 10, 2026',
    time: '10:00 AM – 10:00 PM',
    venue: 'Main Campus Grounds',
    status: 'upcoming',
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    ],
    highlights: ['Live music & DJ sets', 'Food stalls', 'Faculty parade', 'Games & prizes'],
    organizer: 'Students Union Government',
  },
  {
    id: '2',
    title: 'Inauguration of Prof. Adebayo Okonkwo',
    shortDescription:
      'Formal inauguration ceremony for the newly appointed Professor of Electrical Engineering.',
    description:
      'The university community is invited to witness the formal inauguration of Prof. Adebayo Okonkwo as Professor of Electrical Engineering. The ceremony includes an inaugural lecture on sustainable power systems, a citation, and a reception with faculty and guests.',
    date: 'Feb 28, 2026',
    time: '02:00 PM – 05:00 PM',
    venue: 'Senate Chamber, Admin Block',
    status: 'past',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80',
    ],
    highlights: ['Inaugural lecture', 'Faculty procession', 'Light reception', 'Guest speakers'],
    organizer: 'Office of the Vice-Chancellor',
  },
  {
    id: '3',
    title: 'Career Fair 2026',
    shortDescription:
      'Meet recruiters from top companies, attend CV clinics, and explore internship and graduate roles.',
    description:
      'The annual Career Fair connects students with employers across technology, finance, healthcare, and the public sector. Bring printed copies of your CV, dress professionally, and visit booth sessions running throughout the day.',
    date: 'Apr 5, 2026',
    time: '09:00 AM – 04:00 PM',
    venue: 'Faculty of Science Hall',
    status: 'past',
    category: 'Career',
    image: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    ],
    highlights: ['On-the-spot interviews', 'CV review desk', '40+ company booths', 'Networking lounge'],
    organizer: 'Career Services Unit',
  },
  {
    id: '4',
    title: 'Wellness Day',
    shortDescription:
      'Free health screenings, yoga sessions, mental-health talks, and fitness demos for all students.',
    description:
      'Take a break from lectures and prioritise your wellbeing. Wellness Day offers guided yoga, counselling drop-ins, BMI and blood-pressure checks, nutrition talks, and group fitness sessions led by certified instructors.',
    date: 'May 12, 2026',
    time: '08:00 AM – 03:00 PM',
    venue: 'Sports Complex & Health Centre',
    status: 'upcoming',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    ],
    highlights: ['Yoga & meditation', 'Free health checks', 'Counselling sessions', 'Healthy snacks'],
    organizer: 'University Health Services',
  },
  {
    id: '5',
    title: 'Tech Expo 2026',
    shortDescription:
      'Student-led demos of robotics, AI projects, mobile apps, and startup pitches from campus innovators.',
    description:
      'Explore cutting-edge projects built by students and research groups. The Tech Expo features live demos, a hackathon showcase, investor office hours, and workshops on React Native, cloud computing, and product design.',
    date: 'Jun 18, 2026',
    time: '11:00 AM – 06:00 PM',
    venue: 'IT Innovation Hub',
    status: 'upcoming',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    ],
    highlights: ['Live project demos', 'Startup pitches', 'Workshop sessions', 'Networking with alumni'],
    organizer: 'Faculty of Computing',
  },
  {
    id: '6',
    title: 'Matriculation Ceremony 2026',
    shortDescription:
      'Official welcome ceremony for newly admitted students with oath-taking and address by the Vice-Chancellor.',
    description:
      'Newly admitted students are formally inducted into the university community. The ceremony includes the matriculation oath, an address by the Vice-Chancellor, presentation of faculty deans, and a group photograph on the main quadrangle.',
    date: 'Jan 20, 2026',
    time: '09:00 AM – 12:00 PM',
    venue: 'University Auditorium',
    status: 'past',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    ],
    highlights: ['Matriculation oath', 'VC address', 'Faculty introductions', 'Group photo'],
    organizer: 'Registry & Academic Affairs',
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
