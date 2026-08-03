export interface Notice {
  id: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  comments: number;
  likes: number;
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
    title: 'Level 100 Orientation Schedule',
    summary:
      'All Level 100 students must attend a mandatory three-day orientation program. The program covers registration, campus tours, and academic advising. It runs from February 15–17, 2026 and attendance is compulsory.',
    description:
      'All Level 100 students are required to attend the mandatory orientation program scheduled from February 15–17, 2026.\n\n' +
      'The program is designed to help new students settle in quickly and become acquainted with university life. The schedule is as follows:\n\n' +
      'Day 1 — Registration & Campus Welcome (February 15, 9:00 AM – 4:00 PM)\n' +
      '  • Document verification and ID card issuance at the Main Hall\n' +
      '  • Welcome address by the Vice-Chancellor\n' +
      '  • Campus tour in assigned faculty groups\n\n' +
      'Day 2 — Academic Advising & Systems Orientation (February 16, 9:00 AM – 4:00 PM)\n' +
      '  • Departmental orientation and course registration guidance\n' +
      '  • Library and ICT resources workshop\n' +
      '  • Introduction to the student portal and learning management system\n\n' +
      'Day 3 — Student Life & Clubs Fair (February 17, 9:00 AM – 3:00 PM)\n' +
      '  • Student organisations and society fair at the Sports Complex\n' +
      '  • Closing ceremony and pledge\n\n' +
      'Attendance is compulsory for all newly admitted Level 100 students. Any student who cannot attend must obtain prior approval from the Dean of Student Affairs.',
    date: 'Jan 8, 2026',
    comments: 2,
    likes: 9,
  },
  {
    id: '3',
    category: 'General',
    title: 'Course Registration Deadline',
    summary:
      'Course registration for the 2026 semester ends May 20, 2026. Students are advised to complete their selections early through the student portal. Late registration will incur additional fees and may restrict course selection.',
    description:
      'Course registration ends May 20, 2026. Late registration will incur additional fees.\n\n' +
      'All registered students are advised to complete their course selections via the student portal before the deadline on Wednesday, May 20, 2026, at 11:59 PM.\n\n' +
      'Key points:\n' +
      '• Late submissions made between May 21 and May 27 will attract a fee of GHC 150.\n' +
      '• No registrations will be accepted after May 27, 2026.\n' +
      '• Students on academic probation must seek approval from their faculty academic advisor before registering.\n' +
      '• Students changing programmes must submit a programme change request form to the Registrar before the deadline.\n\n' +
      'Course timetables and availability are published on the portal. Students are encouraged to register early to avoid congestion and secure preferred slot combinations.\n\n' +
      'For technical issues with the portal, contact the ICT Helpdesk at helpdesk@university.edu.',
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
    title: 'Second Semester Resumption',
    summary:
      'All students are to resume academic activities for the second semester by April 13, 2026. Lectures and scheduled classes will begin on the same day. Students must clear any outstanding fee balances before resumption.',
    description:
      'All students are to resume academic activities by April 13, 2026.\n\n' +
      'This notice applies to all undergraduate, postgraduate, and distance-learning students. The second semester officially begins on Tuesday, April 13, 2026, and all lectures will commence on that day.\n\n' +
      'Important reminders for resumption:\n' +
      '• All fee balances from the first semester must be cleared before resuming.\n' +
      '• Hostel allocation for continuing residents is automatic; new applicants must apply by April 10, 2026.\n' +
      '• Students returning from medical leave must submit a fitness certificate to the Student Health Centre before the end of the first week.\n' +
      '• The Add/Drop window for the second semester will run from April 13 to April 20, 2026.\n\n' +
      'Students on academic probation are reminded to report to their faculty academic advisor within 48 hours of resumption for guidance.\n\n' +
      'For accommodation enquiries, contact the Accommodation Office. For academic matters, contact your respective faculty office.',
    date: 'Apr 10, 2026',
    comments: 12,
    likes: 4,
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
