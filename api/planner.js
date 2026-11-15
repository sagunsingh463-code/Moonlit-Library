// Vercel Serverless Function: /api/planner
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Study plan tasks default seed
  const defaultTasks = [
    {
      id: 'task-1',
      title: 'Review Corporate Valuation Chapter 8',
      subject: 'Corporate Finance',
      day: 'Monday',
      timeSlot: '08:00 PM - 09:30 PM',
      durationMinutes: 90,
      completed: true,
      isExamPrep: true
    },
    {
      id: 'task-2',
      title: 'Prepare Tesla Luxury EV Positioning Memo',
      subject: 'Marketing Strategy',
      day: 'Tuesday',
      timeSlot: '09:00 PM - 10:30 PM',
      durationMinutes: 90,
      completed: true
    },
    {
      id: 'task-3',
      title: 'Practice Question Bank: Hamada Beta & CAPM',
      subject: 'Corporate Finance',
      day: 'Wednesday',
      timeSlot: '08:30 PM - 09:30 PM',
      durationMinutes: 60,
      completed: true,
      isExamPrep: true
    },
    {
      id: 'task-4',
      title: 'Watch Lecture 09: Behavioral Pricing Insights',
      subject: 'Marketing Strategy',
      day: 'Thursday',
      timeSlot: '09:00 PM - 10:00 PM',
      durationMinutes: 60,
      completed: false
    },
    {
      id: 'task-5',
      title: 'Operations Bottleneck Simulation Practice',
      subject: 'Operations & Supply Chain',
      day: 'Friday',
      timeSlot: '08:00 PM - 09:30 PM',
      durationMinutes: 90,
      completed: false
    },
    {
      id: 'task-6',
      title: 'Weekend MBA Mid-Term Mock Exam & Review',
      subject: 'Corporate Finance',
      day: 'Saturday',
      timeSlot: '10:00 AM - 12:00 PM',
      durationMinutes: 120,
      completed: false,
      isExamPrep: true
    },
    {
      id: 'task-7',
      title: 'Weekly Synthesis & Reflection in Learning Diary',
      subject: 'Managerial Communication',
      day: 'Sunday',
      timeSlot: '07:30 PM - 08:30 PM',
      durationMinutes: 60,
      completed: false
    }
  ];

  if (req.method === 'GET') {
    return res.status(200).json(defaultTasks);
  }

  if (req.method === 'POST') {
    const task = req.body;
    return res.status(200).json({ success: true, task });
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const task = req.body;
    return res.status(200).json({ success: true, task });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
