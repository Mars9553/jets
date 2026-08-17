const SEED_NOTICES = [
  {
    legacyId: '1',
    category: 'General',
    title: 'Welcome to New Academic Year 2026',
    summary:
      'The university warmly welcomes students to the 2026 academic year. The updated academic calendar reflects adjusted start dates and new deadlines for course registration. All students are advised to review the key dates before the start of term.',
    description:
      'Dear students, we are excited to welcome you to the new academic year.\n\nThe Academic Affairs office has published the updated academic calendar, which reflects adjusted start dates for the first semester and new deadlines for course registration. All returning and newly admitted students are expected to familiarise themselves with these dates.\n\nImportant dates to note:\n• First day of lectures: Monday, January 12, 2026\n• Course registration deadline: Friday, January 23, 2026\n• Add/Drop period ends: Friday, January 30, 2026\n\nStudents who fail to complete registration by the stated deadlines will not be permitted to sit for semester examinations.\n\nFor enquiries, contact the Student Records Unit via the Help Desk in the Administration Building.',
    date: 'Jan 8, 2026',
  },
  {
    legacyId: '2',
    category: 'Academic',
    title: 'Academic Calendar for the Second Semester (2025/2026 Academic Session)',
    summary:
      'The Second Semester of the 2025/2026 academic session begins with lectures running from Monday, April 6 to Friday, June 26, 2026, alongside the submission of First Semester examination results between March 30 and April 13, 2026. The annual Students\' Week will take place from Monday, June 8 to Saturday, June 13, 2026. Examinations will follow in batches: Year 4 and 5 students write from July 6 to July 10, Year 2 and 3 students from July 13 to July 17 (and continuing July 27 to July 31), Year 1 students from July 20 to July 24, and BMAS students (Years 1, 2, and 3) from August 3 to August 7, 2026.',
    description:
      'Following the examination period, Second Semester results are scheduled for submission between Monday, August 10 and Friday, August 21, 2026, with Project Defenses (External Examinations) set for August 12 to August 14, 2026. Faculty Board and related meetings to consider both First and Second Semester results will hold from August 24 to August 28, 2026, leading up to the Senate Meeting on Thursday, September 24, 2026, to finalize the results. The 2025/2026 academic session will officially conclude on Friday, September 25, 2026, followed by the end-of-session vacation running from Saturday, September 26 to Saturday, October 17, 2026.',
    date: 'Jan 8, 2026',
    imageUrl: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/notice-images/academic_calendar.jpg',
  },
  {
    legacyId: '3',
    category: 'General',
    title: 'Course registration for the second semester',
    summary:
      'Course registration for the second semester officially commenced in July for continuing students. To complete this process and maintain academic standing, students are required to settle all outstanding school fee payments in full. Failure to clear these financial obligations will restrict students from registering for their modules and render them ineligible to write the upcoming second-semester examinations.',
    description:
      'Students are strongly encouraged to finalize their registrations as early as possible to avoid financial penalties. While course enrollment remains open, any late submissions completed after the designated standard deadline will incur late registration fines. Completing both fee payments and course selection promptly ensures uninterrupted access to exam halls and prevents unnecessary additional charges.',
    date: 'Feb 11, 2026',
  },
  {
    legacyId: '4',
    category: 'Career',
    title: 'Internship Opportunities',
    summary:
      'Internship placements are now open across multiple industries for the upcoming semester. Students can apply for positions in technology, finance, healthcare, and the public sector. Applications close on April 30, 2026 via the Careers Portal.',
    description:
      'Exciting internship opportunities are available for students across various industries.\n\nThe Career Services Unit has partnered with leading organisations to offer semester-long internships for undergraduate and postgraduate students. Placements run from June to August 2026 and include both paid and unpaid options.\n\nAvailable sectors:\n• Technology & Software Development — roles in web/mobile development, data analysis, and cybersecurity.\n• Finance & Banking — audit, corporate finance, and investment research placements.\n• Healthcare & Pharmaceuticals — clinical and administrative support roles.\n• Public Sector & NGOs — policy research, project coordination, and community development.\n• Media & Communications — content creation, marketing, and press office support.\n\nApplication process:\n1. Submit your CV and a cover letter via the Careers Portal by April 30, 2026.\n2. Shortlisted candidates will be invited for an interview during the week of May 8–14, 2026.\n3. Final placements will be confirmed and communicated by May 20, 2026.\n\nAttendance at the mandatory pre-placement workshop (May 3, 2026) is required for all applicants.\n\nFor more information, visit the Career Services Unit in the Student Affairs Complex or email careers@university.edu.',
    date: 'Mar 8, 2026',
  },
  {
    legacyId: '5',
    category: 'Urgent',
    title: 'Graduation Requirements',
    summary:
      'Final year students must submit thesis proposals by April 25, 2026. All submissions must follow the approved departmental format and include a signed supervision approval form. Late submissions will delay graduation clearance.',
    description:
      'Final year students must submit their thesis proposals by April 25, 2026.\n\nThis is a mandatory requirement for all undergraduate and postgraduate students in their graduating semester. Failure to submit a proposal by the deadline will delay graduation clearance.\n\nSubmission requirements:\n• A typed proposal of no fewer than 3,000 words following the Departmental Thesis Manual (latest edition).\n• Abstract of not more than 300 words.\n• Signed supervision approval form (available from your department).\n• Soft copy in PDF format uploaded to the Thesis Submission Portal.\n• One hard-bound copy submitted to the Departmental Office.\n\nFormatting guidelines:\n• Font: Times New Roman, size 12; Line spacing: 1.5; Margins: 2.54 cm on all sides.\n• References must follow the APA (7th edition) style.\n• All charts, figures, and tables must be captioned and numbered.\n\nThe deadline for submission is strict and no extensions will be granted except in exceptional circumstances approved by the Academic Board. Queries should be directed to the Faculty Officer or the Departmental Thesis Coordinator.\n\nSubmission portal: https://portal.university.edu/thesis',
    date: 'Apr 17, 2026',
  },
  {
    legacyId: '6',
    category: 'General',
    title: 'School Resumption for 2025/2026',
    summary:
      'This official press release from the Office of the Registrar at Rivers State University announces the commencement of academic activities for the 2025/2026 session on Monday, November 3, 2025. In preparation for the new academic year, university management approved the reopening of hostels on Sunday, November 2, 2025, to allow registered students to sign in. Students are urged to pay both their school fees and accommodation fees promptly to ensure they secure a bed space for the upcoming term.',
    description:
      'This official press release from the Office of the Registrar at Rivers State University announces the commencement of academic activities for the 2025/2026 session on Monday, November 3, 2025.\n\nIn preparation for the new academic year, university management approved the reopening of hostels on Sunday, November 2, 2025, to allow registered students to sign in. Students are urged to pay both their school fees and accommodation fees promptly to ensure they secure a bed space for the upcoming term.\n\nTo oversee bed space allocation and preserve order, Vice-Chancellor Prof. Isaac Zeb-Obipi inaugurated Hall Wardens on October 24, 2025, instructing them to maintain strict hostel discipline. Additionally, the Vice-Chancellor explicitly prohibited the sale or transfer of bed spaces, warning that any student found committing this offense will face appropriate disciplinary measures.\n\nThe document concludes with Registrar Mrs. I. B. S. Harry advising all students to comply fully with these directives for a smooth start to the session.',
    date: 'Oct 24, 2025',
    imageUrl: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/notice-images/resumption.jpg',
  },
  {
    legacyId: '7',
    category: 'Urgent',
    title: 'Second Semester Examination Timetable',
    summary:
      'The second semester examination timetable is now available. Students should check their faculty notice board and the student portal for personalised schedules. Examinations run from May 25 to June 18, 2026 and all assessment rules apply.',
    description:
      'The second semester examination timetable is now available. Check your faculty notice board.\n\nThe Registrar has released the timetable for the second semester University examinations, scheduled to run from May 25 to June 18, 2026. Each student\'s personal timetable is now accessible on the student portal under the "My Examinations" tab.\n\nExamination guidelines:\n• All students must bring their validated student ID cards and a government-issued photo ID to each examination.\n• Only approved calculators, writing materials, and relevant textbooks are permitted in the examination hall.\n• Examinations begin promptly at 9:00 AM; no candidate will be admitted after 30 minutes from the stated start time.\n• Students requiring special accommodation (e.g., extra time, scribes) must submit an application to the Disability Support Services two weeks before the exam.\n\nRescheduling:\n• Requests to defer or reschedule an examination are only considered for medical or compassionate grounds and require documented evidence submitted at least 48 hours before the affected paper.\n• No rescheduling will be entertained after the first week of examinations.\n\nStudents with timetable conflicts should report immediately to the Examinations Officer in the Registry. Good preparation and adherence to the rules are strongly encouraged.',
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
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_2.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_3.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_4.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_5.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/sug_week/sug_week_6.jpg',
    ],
    highlights: ['Live music & DJ sets', 'Food stalls', 'Faculty parade', 'Games & prizes'],
    organizer: 'Students Union Government',
  },
  {
    legacyId: '2',
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
  },
  {
    legacyId: '3',
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
  },
  {
    legacyId: '4',
    title: 'Global South Index Buildathon 2026',
    shortDescription:
      'A collaborative buildathon bringing together students to create data tools, visualizations, and policy prototypes for Global South development challenges.',
    description:
      'The Global South Index Buildathon 2026 invites developers, researchers, and policy students to build open-source tools, dashboards, and datasets that illuminate development indicators across the Global South.\n\nOver two days, participants will work in cross-disciplinary teams to prototype index frameworks, build data visualizations, and create policy briefs addressing real-world challenges in education, healthcare, infrastructure, and economic empowerment.\n\nEvent Schedule:\n• Day 1: Keynote & team formation, dataset workshop, hackathon begins\n• Day 2: Prototype presentations, judging panel, award ceremony\n\nMentors from development agencies, tech companies, and academia will be available throughout. Participation is open to all RSU students. Prizes include internships, seed funding for promising projects, and publication opportunities.',
    date: 'Aug 22, 2026',
    time: '09:00 AM',
    venue: 'Manor House,5 Chukwu Close,Off Stadium Rd.',
    status: 'upcoming',
    category: 'Technology',
    image: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_1.jpg',
    gallery: [
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_1.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_2.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_3.jpg',
      'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/event-images/global_south_index/gsi_4.jpg',
    ],
    highlights: ["Live Pitch Battles", "Tech Job Offers", "Industry Networking", "Platform Reveal"],
    organizer: 'Parakletus Hub Nigeria.',
  },
  {
    legacyId: '5',
    title: 'Tech Expo 2026',
    shortDescription:
      'Student-led demos of robotics, AI projects, mobile apps, and startup pitches from campus innovators.',
    description:
      'Explore cutting-edge projects built by students and research groups at the Tech Expo.',
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
  },
  {
    legacyId: '6',
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
  },
];

module.exports = { SEED_NOTICES, SEED_EVENTS };
