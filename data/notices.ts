export interface Notice {
  id: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  comments: number;
  likes: number;
  imageUrl?: string;
}

export const NOTICES: Notice[] = [
  {
    id: '1',
    category: 'General',
    title: 'Welcome to New Academic Year 2026',
    summary:
      'The university warmly welcomes students to the 2026 academic year. The updated academic calendar reflects adjusted start dates and new deadlines for course registration. All students are advised to review the key dates before the start of term.',
    description:
      'Dear students, we are excited to welcome you to the new academic year.\n\n' +
      'The Academic Affairs office has published the updated academic calendar, which reflects adjusted start dates for the first semester and new deadlines for course registration. All returning and newly admitted students are expected to familiarise themselves with these dates.\n\n' +
      'Important dates to note:\n' +
      '• First day of lectures: Monday, January 12, 2026\n' +
      '• Course registration deadline: Friday, January 23, 2026\n' +
      '• Add/Drop period ends: Friday, January 30, 2026\n\n' +
      'Students who fail to complete registration by the stated deadlines will not be permitted to sit for semester examinations.\n\n' +
      'For enquiries, contact the Student Records Unit via the Help Desk in the Administration Building.',
    date: 'Jan 8, 2026',
    comments: 21,
    likes: 4,
  },
  {
    id: '2',
    category: 'Academic',
    title: 'Academic Calendar for the Second Semester (2025/2026 Academic Session)',
    summary:
      'The Second Semester of the 2025/2026 academic session begins with lectures running from Monday, April 6 to Friday, June 26, 2026, alongside the submission of First Semester examination results between March 30 and April 13, 2026. The annual Students\' Week will take place from Monday, June 8 to Saturday, June 13, 2026. Examinations will follow in batches: Year 4 and 5 students write from July 6 to July 10, Year 2 and 3 students from July 13 to July 17 (and continuing July 27 to July 31), Year 1 students from July 20 to July 24, and BMAS students (Years 1, 2, and 3) from August 3 to August 7, 2026.',
    description:
      'Following the examination period, Second Semester results are scheduled for submission between Monday, August 10 and Friday, August 21, 2026, with Project Defenses (External Examinations) set for August 12 to August 14, 2026. Faculty Board and related meetings to consider both First and Second Semester results will hold from August 24 to August 28, 2026, leading up to the Senate Meeting on Thursday, September 24, 2026, to finalize the results. The 2025/2026 academic session will officially conclude on Friday, September 25, 2026, followed by the end-of-session vacation running from Saturday, September 26 to Saturday, October 17, 2026.',
    date: 'Jan 8, 2026',
    comments: 2,
    likes: 9,
    imageUrl: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/notice-images/academic_calendar.jpg',
  },
  {
    id: '3',
    category: 'General',
    title: 'Course registration for the second semester',
    summary:
      'Course registration for the second semester officially commenced in July for continuing students. To complete this process and maintain academic standing, students are required to settle all outstanding school fee payments in full. Failure to clear these financial obligations will restrict students from registering for their modules and render them ineligible to write the upcoming second-semester examinations.',
    description:
      'Students are strongly encouraged to finalize their registrations as early as possible to avoid financial penalties. While course enrollment remains open, any late submissions completed after the designated standard deadline will incur late registration fines. Completing both fee payments and course selection promptly ensures uninterrupted access to exam halls and prevents unnecessary additional charges.',
    date: 'Feb 11, 2026',
    comments: 4,
    likes: 3,
  },
  {
    id: '4',
    category: 'Career',
    title: 'Internship Opportunities',
    summary:
      'Internship placements are now open across multiple industries for the upcoming semester. Students can apply for positions in technology, finance, healthcare, and the public sector. Applications close on April 30, 2026 via the Careers Portal.',
    description:
      'Exciting internship opportunities are available for students across various industries.\n\n' +
      'The Career Services Unit has partnered with leading organisations to offer semester-long internships for undergraduate and postgraduate students. Placements run from June to August 2026 and include both paid and unpaid options.\n\n' +
      'Available sectors:\n' +
      '• Technology & Software Development — roles in web/mobile development, data analysis, and cybersecurity.\n' +
      '• Finance & Banking — audit, corporate finance, and investment research placements.\n' +
      '• Healthcare & Pharmaceuticals — clinical and administrative support roles.\n' +
      '• Public Sector & NGOs — policy research, project coordination, and community development.\n' +
      '• Media & Communications — content creation, marketing, and press office support.\n\n' +
      'Application process:\n' +
      '1. Submit your CV and a cover letter via the Careers Portal by April 30, 2026.\n' +
      '2. Shortlisted candidates will be invited for an interview during the week of May 8–14, 2026.\n' +
      '3. Final placements will be confirmed and communicated by May 20, 2026.\n\n' +
      'Attendance at the mandatory pre-placement workshop (May 3, 2026) is required for all applicants.\n\n' +
      'For more information, visit the Career Services Unit in the Student Affairs Complex or email careers@university.edu.',
    date: 'Mar 8, 2026',
    comments: 34,
    likes: 23,
  },
  {
    id: '5',
    category: 'Urgent',
    title: 'Graduation Requirements',
    summary:
      'Final year students must submit thesis proposals by April 25, 2026. All submissions must follow the approved departmental format and include a signed supervision approval form. Late submissions will delay graduation clearance.',
    description:
      'Final year students must submit their thesis proposals by April 25, 2026.\n\n' +
      'This is a mandatory requirement for all undergraduate and postgraduate students in their graduating semester. Failure to submit a proposal by the deadline will delay graduation clearance.\n\n' +
      'Submission requirements:\n' +
      '• A typed proposal of no fewer than 3,000 words following the Departmental Thesis Manual (latest edition).\n' +
      '• Abstract of not more than 300 words.\n' +
      '• Signed supervision approval form (available from your department).\n' +
      '• Soft copy in PDF format uploaded to the Thesis Submission Portal.\n' +
      '• One hard-bound copy submitted to the Departmental Office.\n\n' +
      'Formatting guidelines:\n' +
      '• Font: Times New Roman, size 12; Line spacing: 1.5; Margins: 2.54 cm on all sides.\n' +
      '• References must follow the APA (7th edition) style.\n' +
      '• All charts, figures, and tables must be captioned and numbered.\n\n' +
      'The deadline for submission is strict and no extensions will be granted except in exceptional circumstances approved by the Academic Board. Queries should be directed to the Faculty Officer or the Departmental Thesis Coordinator.\n\n' +
      'Submission portal: https://portal.university.edu/thesis',
    date: 'Apr 17, 2026',
    comments: 2,
    likes: 5,
  },
  {
    id: '6',
    category: 'General',
    title: 'School Resumption for 2025/2026',
    summary:
      'This official press release from the Office of the Registrar at Rivers State University announces the commencement of academic activities for the 2025/2026 session on Monday, November 3, 2025. In preparation for the new academic year, university management approved the reopening of hostels on Sunday, November 2, 2025, to allow registered students to sign in. Students are urged to pay both their school fees and accommodation fees promptly to ensure they secure a bed space for the upcoming term.',
    description:
      'This official press release from the Office of the Registrar at Rivers State University announces the commencement of academic activities for the 2025/2026 session on Monday, November 3, 2025.\n\n' +
      'In preparation for the new academic year, university management approved the reopening of hostels on Sunday, November 2, 2025, to allow registered students to sign in. Students are urged to pay both their school fees and accommodation fees promptly to ensure they secure a bed space for the upcoming term.\n\n' +
      'To oversee bed space allocation and preserve order, Vice-Chancellor Prof. Isaac Zeb-Obipi inaugurated Hall Wardens on October 24, 2025, instructing them to maintain strict hostel discipline. Additionally, the Vice-Chancellor explicitly prohibited the sale or transfer of bed spaces, warning that any student found committing this offense will face appropriate disciplinary measures.\n\n' +
      'The document concludes with Registrar Mrs. I. B. S. Harry advising all students to comply fully with these directives for a smooth start to the session.',
    date: 'Oct 24, 2025',
    comments: 12,
    likes: 4,
    imageUrl: 'https://ypeazvixfahfhnonqqra.supabase.co/storage/v1/object/public/notice-images/resumption.jpg',
  },
  {
    id: '7',
    category: 'Urgent',
    title: 'Second Semester Examination Timetable',
    summary:
      'The second semester examination timetable is now available. Students should check their faculty notice board and the student portal for personalised schedules. Examinations run from May 25 to June 18, 2026 and all assessment rules apply.',
    description:
      'The second semester examination timetable is now available. Check your faculty notice board.\n\n' +
      'The Registrar has released the timetable for the second semester University examinations, scheduled to run from May 25 to June 18, 2026. Each student\'s personal timetable is now accessible on the student portal under the "My Examinations" tab.\n\n' +
      'Examination guidelines:\n' +
      '• All students must bring their validated student ID cards and a government-issued photo ID to each examination.\n' +
      '• Only approved calculators, writing materials, and relevant textbooks are permitted in the examination hall.\n' +
      '• Examinations begin promptly at 9:00 AM; no candidate will be admitted after 30 minutes from the stated start time.\n' +
      '• Students requiring special accommodation (e.g., extra time, scribes) must submit an application to the Disability Support Services two weeks before the exam.\n\n' +
      'Rescheduling:\n' +
      '• Requests to defer or reschedule an examination are only considered for medical or compassionate grounds and require documented evidence submitted at least 48 hours before the affected paper.\n' +
      '• No rescheduling will be entertained after the first week of examinations.\n\n' +
      'Students with timetable conflicts should report immediately to the Examinations Officer in the Registry. Good preparation and adherence to the rules are strongly encouraged.',
    date: 'Jun 23, 2026',
    comments: 55,
    likes: 45,
  },
];
