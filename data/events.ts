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
    image: 'https://source.unsplash.com/800x600/?nigerian,students,university,port-harcourt',
    gallery: [
      'https://source.unsplash.com/800x600/?nigerian,students,celebration',
      'https://source.unsplash.com/800x600/?african,university,campus',
      'https://source.unsplash.com/800x600/?nigerian,students,parade',
      'https://source.unsplash.com/800x600/?port-harcourt,students',
      'https://source.unsplash.com/800x600/?african,youth,gathering',
      'https://source.unsplash.com/800x600/?nigerian,students,event',
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
    title: 'Inauguration of Prof. Adebayo Okonkwo',
    shortDescription:
      'Formal inauguration ceremony for the newly appointed Professor of Electrical Engineering.',
    description:
      'The university community is invited to witness the formal inauguration of Prof. Adebayo Okonkwo as Professor of Electrical Engineering. The ceremony includes an inaugural lecture on sustainable power systems, a citation, and a reception with faculty and guests.',
    date: 'Feb 28, 2026',
    time: '02:00 PM \u2013 05:00 PM',
    venue: 'Senate Chamber, Admin Block',
    status: 'past',
    category: 'Academic',
    image: 'https://source.unsplash.com/800x600/?nigerian,professor,academic',
    gallery: [
      'https://source.unsplash.com/800x600/?african,professor,lecture',
      'https://source.unsplash.com/800x600/?nigerian,university,faculty',
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
    title: 'Career Fair 2026',
    shortDescription:
      'Meet recruiters from top companies, attend CV clinics, and explore internship and graduate roles.',
    description:
      'The annual Career Fair connects students with employers across technology, finance, healthcare, and the public sector. Bring printed copies of your CV, dress professionally, and visit booth sessions running throughout the day.',
    date: 'Apr 5, 2026',
    time: '09:00 AM \u2013 04:00 PM',
    venue: 'Faculty of Science Hall',
    status: 'past',
    category: 'Career',
    image: 'https://source.unsplash.com/800x600/?nigerian,students,career-fair',
    gallery: [
      'https://source.unsplash.com/800x600/?african,students,recruitment',
      'https://source.unsplash.com/800x600/?nigerian,university,career',
    ],
    highlights: ['On-the-spot interviews', 'CV review desk', '40+ company booths', 'Networking lounge'],
    organizer: 'Career Services Unit',
    likes: 8,
    liked: false,
    attending: 67,
    userAttending: false,
  },
  {
    id: '4',
    title: 'Wellness Day',
    shortDescription:
      'Free health screenings, yoga sessions, mental-health talks, and fitness demos for all students.',
    description:
      'Take a break from lectures and prioritise your wellbeing. Wellness Day offers guided yoga, counselling drop-ins, BMI and blood-pressure checks, nutrition talks, and group fitness sessions led by certified instructors.',
    date: 'May 12, 2026',
    time: '08:00 AM \u2013 03:00 PM',
    venue: 'Sports Complex & Health Centre',
    status: 'upcoming',
    category: 'Health',
    image: 'https://source.unsplash.com/800x600/?african,students,yoga,wellness',
    gallery: [
      'https://source.unsplash.com/800x600/?nigerian,students,health',
      'https://source.unsplash.com/800x600/?african,fitness,university',
    ],
    highlights: ['Yoga & meditation', 'Free health checks', 'Counselling sessions', 'Healthy snacks'],
    organizer: 'University Health Services',
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
    image: 'https://source.unsplash.com/800x600/?nigerian,students,technology',
    gallery: [
      'https://source.unsplash.com/800x600/?african,students,computer',
      'https://source.unsplash.com/800x600/?nigerian,university,tech',
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
    title: 'Matriculation Ceremony 2026',
    shortDescription:
      'Official welcome ceremony for newly admitted students with oath-taking and address by the Vice-Chancellor.',
    description:
      'Newly admitted students are formally inducted into the university community. The ceremony includes the matriculation oath, an address by the Vice-Chancellor, presentation of faculty deans, and a group photograph on the main quadrangle.',
    date: 'Jan 20, 2026',
    time: '09:00 AM \u2013 12:00 PM',
    venue: 'University Auditorium',
    status: 'past',
    category: 'Academic',
    image: 'https://source.unsplash.com/800x600/?nigerian,graduation,university',
    gallery: [
      'https://source.unsplash.com/800x600/?african,students,matriculation',
      'https://source.unsplash.com/800x600/?nigerian,university,ceremony',
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