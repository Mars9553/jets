const SEED_NOTICES = [
  {
    legacyId: '1',
    category: 'General',
    title: 'Welcome to New Academic Year 2026',
    description:
      'Dear students, we are excited to welcome you to the new academic year. Please review the updated academic calendar.',
    date: 'Jan 8, 2026',
  },
  {
    legacyId: '2',
    category: 'Academic',
    title: 'Level 100 Orientation Schedule',
    description:
      'All Level 100 students are required to attend the orientation program from February 15–17, 2026.',
    date: 'Jan 8, 2026',
  },
  {
    legacyId: '3',
    category: 'General',
    title: 'Course Registration Deadline',
    description:
      'Course registration ends May 20, 2026. Late registration will incur additional fees.',
    date: 'Feb 11, 2026',
  },
  {
    legacyId: '4',
    category: 'Career',
    title: 'Internship Opportunities',
    description:
      'Exciting internship opportunities are available for students across various industries.',
    date: 'Mar 8, 2026',
  },
  {
    legacyId: '5',
    category: 'Urgent',
    title: 'Graduation Requirements',
    description:
      'Final year students must submit their thesis proposals by April 25, 2026.',
    date: 'Apr 17, 2026',
  },
  {
    legacyId: '6',
    category: 'General',
    title: 'Second Semester Resumption',
    description: 'All students are to resume academic activities by April 13, 2026.',
    date: 'Apr 10, 2026',
  },
  {
    legacyId: '7',
    category: 'Urgent',
    title: 'Second Semester Examination Timetable',
    description:
      'The second semester examination timetable is now available. Check your faculty notice board.',
    date: 'Jun 23, 2026',
  },
];

const SEED_EVENTS = [
  {
    legacyId: '1',
    title: 'SUG Week 2026',
    shortDescription:
      'A week-long celebration of student life with games, concerts, food stalls, and faculty competitions across campus.',
    description:
      'Join the Students Union Government for the biggest week of the semester. SUG Week brings together every faculty for parades, talent shows, debate finals, and nightly entertainment.',
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
    legacyId: '2',
    title: 'Inauguration of Prof. Adebayo Okonkwo',
    shortDescription:
      'Formal inauguration ceremony for the newly appointed Professor of Electrical Engineering.',
    description:
      'The university community is invited to witness the formal inauguration of Prof. Adebayo Okonkwo as Professor of Electrical Engineering.',
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
    legacyId: '3',
    title: 'Career Fair 2026',
    shortDescription:
      'Meet recruiters from top companies, attend CV clinics, and explore internship and graduate roles.',
    description:
      'The annual Career Fair connects students with employers across technology, finance, healthcare, and the public sector.',
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
    legacyId: '4',
    title: 'Wellness Day',
    shortDescription:
      'Free health screenings, yoga sessions, mental-health talks, and fitness demos for all students.',
    description:
      'Take a break from lectures and prioritise your wellbeing with yoga, counselling drop-ins, and health checks.',
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
    legacyId: '5',
    title: 'Tech Expo 2026',
    shortDescription:
      'Student-led demos of robotics, AI projects, mobile apps, and startup pitches from campus innovators.',
    description:
      'Explore cutting-edge projects built by students and research groups at the Tech Expo.',
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
    legacyId: '6',
    title: 'Matriculation Ceremony 2026',
    shortDescription:
      'Official welcome ceremony for newly admitted students with oath-taking and address by the Vice-Chancellor.',
    description:
      'Newly admitted students are formally inducted into the university community at the matriculation ceremony.',
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

module.exports = { SEED_NOTICES, SEED_EVENTS };
