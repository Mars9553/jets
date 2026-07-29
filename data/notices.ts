export interface Notice {
  id: string;
  category: string;
  title: string;
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
    description:
      'Dear students, we are excited to welcome you to the new academic year. Please review the updated academic calendar.',
    date: 'Jan 8, 2026',
    comments: 21,
    likes: 4,
  },
  {
    id: '2',
    category: 'Academic',
    title: 'Level 100 Orientation Schedule',
    description:
      'All Level 100 students are required to attend the orientation program from February 15–17, 2026.',
    date: 'Jan 8, 2026',
    comments: 2,
    likes: 9,
  },
  {
    id: '3',
    category: 'General',
    title: 'Course Registration Deadline',
    description: 'Course registration ends May 20, 2026. Late registration will incur additional fees.',
    date: 'Feb 11, 2026',
    comments: 4,
    likes: 3,
  },
  {
    id: '4',
    category: 'Career',
    title: 'Internship Opportunities',
    description: 'Exciting internship opportunities are available for students across various industries.',
    date: 'Mar 8, 2026',
    comments: 34,
    likes: 23,
  },
  {
    id: '5',
    category: 'Urgent',
    title: 'Graduation Requirements',
    description: 'Final year students must submit their thesis proposals by April 25, 2026.',
    date: 'Apr 17, 2026',
    comments: 2,
    likes: 5,
  },
  {
    id: '6',
    category: 'General',
    title: 'Second Semester Resumption',
    description: 'All students are to resume academic activities by April 13, 2026.',
    date: 'Apr 10, 2026',
    comments: 12,
    likes: 4,
  },
  {
    id: '7',
    category: 'Urgent',
    title: 'Second Semester Examination Timetable',
    description: 'The second semester examination timetable is now available. Check your faculty notice board.',
    date: 'Jun 23, 2026',
    comments: 55,
    likes: 45,
  },
];
