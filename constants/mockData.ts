export interface Subject {
  id: string;
  name: string;
  grade: string;
  percentage: number;
  teacher: string;
  color: string;
  trend: "up" | "down" | "stable";
  nextClass?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  color: string;
  priority?: "high" | "medium" | "low";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "info" | "warning" | "event";
}

export interface College {
  id: string;
  name: string;
  location: string;
  ranking: number;
  acceptanceRate: string;
  image: string;
  deadline: string;
  tags: string[];
  tuition?: string;
}

export interface Career {
  id: string;
  title: string;
  field: string;
  salary: string;
  growth: string;
  icon: string;
  description?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  rating: number;
  enrolled: number;
  image: string;
  color: string;
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  role: string;
  online?: boolean;
}

export interface StudySession {
  day: string;
  hours: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  subject: string;
  dueTime?: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  target: number;
  completed: number;
  color: string;
  icon: string;
}

export const applicationProfile = {
  personalStatement: { status: "review" as const, wordCount: 587, wordLimit: 650 },
  totalColleges: 6,
  submitted: 2,
  accepted: 1,
  inProgress: 2,
  notStarted: 1,
  totalEssays: 6,
  essaysCompleted: 4,
  activitiesCount: 5,
  honorsCount: 4,
  recommendersCount: 3,
  recommendersSubmitted: 2,
};

export const studentProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@edudash.edu",
  school: "Westfield Academy",
  grade: "11th Grade",
  gpa: 3.87,
  classRank: 12,
  totalStudents: 340,
  attendance: 96.5,
  totalCredits: 68,
  targetCredits: 80,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  joinDate: "Sep 2024",
  completedCourses: 14,
  upcomingExams: 3,
};

export const subjects: Subject[] = [
  { id: "1", name: "AP Calculus BC", grade: "A", percentage: 94, teacher: "Dr. Williams", color: "#22D3A7", trend: "up", nextClass: "Mon 9:00 AM" },
  { id: "2", name: "AP Physics C", grade: "A-", percentage: 91, teacher: "Mr. Chen", color: "#5B9CF6", trend: "stable", nextClass: "Mon 10:30 AM" },
  { id: "3", name: "AP English Lit", grade: "B+", percentage: 88, teacher: "Ms. Parker", color: "#9F8CF7", trend: "up", nextClass: "Tue 9:00 AM" },
  { id: "4", name: "AP Chemistry", grade: "A", percentage: 95, teacher: "Dr. Martinez", color: "#F59E42", trend: "up", nextClass: "Tue 11:00 AM" },
  { id: "5", name: "AP US History", grade: "A-", percentage: 92, teacher: "Mr. Thompson", color: "#F5A623", trend: "down", nextClass: "Wed 9:00 AM" },
  { id: "6", name: "AP Computer Sci", grade: "A+", percentage: 98, teacher: "Ms. Lee", color: "#EC6C9C", trend: "up", nextClass: "Wed 1:00 PM" },
];

export const assignments: Assignment[] = [
  { id: "1", title: "Calculus Problem Set #12", subject: "AP Calculus BC", dueDate: "Tomorrow", status: "pending", color: "#22D3A7", priority: "high" },
  { id: "2", title: "Lab Report: Kinematics", subject: "AP Physics C", dueDate: "Feb 10", status: "pending", color: "#5B9CF6", priority: "medium" },
  { id: "3", title: "Essay: Hamlet Analysis", subject: "AP English Lit", dueDate: "Feb 12", status: "pending", color: "#9F8CF7", priority: "high" },
  { id: "4", title: "Chapter 8 Review", subject: "AP Chemistry", dueDate: "Feb 8", status: "submitted", color: "#F59E42", priority: "low" },
  { id: "5", title: "DBQ Practice", subject: "AP US History", dueDate: "Feb 14", status: "pending", color: "#F5A623", priority: "medium" },
  { id: "6", title: "Binary Tree Implementation", subject: "AP Computer Sci", dueDate: "Feb 15", status: "pending", color: "#EC6C9C", priority: "high" },
];

export const announcements: Announcement[] = [
  { id: "1", title: "Midterm Exams Schedule Released", body: "Midterm exams begin March 3rd. Check your schedule in the portal.", time: "2h ago", type: "warning" },
  { id: "2", title: "Science Fair Registration Open", body: "Sign up for the annual science fair by February 20th.", time: "5h ago", type: "event" },
  { id: "3", title: "Library Hours Extended", body: "Library will be open until 9 PM during exam season.", time: "1d ago", type: "info" },
];

export const colleges: College[] = [
  {
    id: "1", name: "MIT", location: "Cambridge, MA",
    ranking: 1, acceptanceRate: "3.9%",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=250&fit=crop",
    deadline: "Jan 1, 2027", tags: ["STEM", "Research", "Innovation"], tuition: "$57,590",
  },
  {
    id: "2", name: "Stanford University", location: "Stanford, CA",
    ranking: 3, acceptanceRate: "3.6%",
    image: "https://images.unsplash.com/photo-1584598111372-54ccf343a3af?w=400&h=250&fit=crop",
    deadline: "Jan 2, 2027", tags: ["Tech", "Entrepreneurship"], tuition: "$56,169",
  },
  {
    id: "3", name: "Harvard University", location: "Cambridge, MA",
    ranking: 2, acceptanceRate: "3.4%",
    image: "https://images.unsplash.com/photo-1559135197-8a45ea74d367?w=400&h=250&fit=crop",
    deadline: "Jan 1, 2027", tags: ["Liberal Arts", "Law", "Medicine"], tuition: "$54,269",
  },
  {
    id: "4", name: "UC Berkeley", location: "Berkeley, CA",
    ranking: 15, acceptanceRate: "11.4%",
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&h=250&fit=crop",
    deadline: "Nov 30, 2026", tags: ["Public", "Research", "CS"], tuition: "$44,007",
  },
  {
    id: "5", name: "Georgia Tech", location: "Atlanta, GA",
    ranking: 33, acceptanceRate: "17%",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop",
    deadline: "Jan 4, 2027", tags: ["Engineering", "Tech"], tuition: "$33,794",
  },
];

export const careers: Career[] = [
  { id: "1", title: "Software Engineer", field: "Technology", salary: "$120k–$200k", growth: "+25%", icon: "code", description: "Design and build software systems" },
  { id: "2", title: "Data Scientist", field: "Analytics", salary: "$110k–$180k", growth: "+36%", icon: "bar-chart-2", description: "Analyze complex datasets for insights" },
  { id: "3", title: "Biomedical Engineer", field: "Healthcare", salary: "$95k–$150k", growth: "+10%", icon: "heart-pulse", description: "Develop medical devices and systems" },
  { id: "4", title: "UX Designer", field: "Design", salary: "$90k–$150k", growth: "+13%", icon: "palette", description: "Create intuitive user experiences" },
  { id: "5", title: "Financial Analyst", field: "Finance", salary: "$85k–$140k", growth: "+9%", icon: "trending-up", description: "Guide investment and business decisions" },
];

export const courses: Course[] = [
  { id: "1", title: "SAT Math Mastery", category: "Test Prep", duration: "8 weeks", level: "Advanced", rating: 4.8, enrolled: 12400, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop", color: "#22D3A7" },
  { id: "2", title: "AP Biology Review", category: "Science", duration: "6 weeks", level: "Intermediate", rating: 4.6, enrolled: 8300, image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=300&h=200&fit=crop", color: "#5B9CF6" },
  { id: "3", title: "College Essay Writing", category: "Writing", duration: "4 weeks", level: "All Levels", rating: 4.9, enrolled: 15600, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop", color: "#9F8CF7" },
  { id: "4", title: "Python for Beginners", category: "CS", duration: "10 weeks", level: "Beginner", rating: 4.7, enrolled: 22100, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop", color: "#F59E42" },
];

export const messages: Message[] = [
  { id: "1", sender: "Dr. Williams", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", preview: "Great work on the last assignment! I'd like to discuss your approach to problem 7.", time: "2m ago", unread: true, role: "Teacher", online: true },
  { id: "2", sender: "Ms. Parker", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", preview: "Your essay draft shows significant improvement. Let's review the thesis statement.", time: "1h ago", unread: true, role: "Teacher", online: false },
  { id: "3", sender: "Counselor Davis", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", preview: "I've reviewed your college list. We should schedule a meeting this week.", time: "3h ago", unread: false, role: "Counselor", online: true },
  { id: "4", sender: "Physics Study Group", avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=face", preview: "Who's up for a physics study session tomorrow at the library?", time: "5h ago", unread: false, role: "Group", online: false },
  { id: "5", sender: "System Alert", avatar: "", preview: "Your AP Chemistry grade has been updated to A. View details.", time: "1d ago", unread: false, role: "System", online: false },
  { id: "6", sender: "Ms. Lee", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", preview: "Reminder: Binary tree project due next Friday. Office hours available Thursday.", time: "2d ago", unread: false, role: "Teacher", online: false },
];

export const weeklyStudy: StudySession[] = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 4.2 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 5.1 },
  { day: "Fri", hours: 3.0 },
  { day: "Sat", hours: 6.5 },
  { day: "Sun", hours: 4.0 },
];

export const tasks: Task[] = [
  { id: "1", title: "Review Calculus Ch. 12", completed: false, priority: "high", subject: "AP Calculus BC", dueTime: "Today 5PM" },
  { id: "2", title: "Read Hamlet Act 4", completed: false, priority: "medium", subject: "AP English Lit", dueTime: "Tomorrow" },
  { id: "3", title: "Physics lab prep", completed: true, priority: "high", subject: "AP Physics C", dueTime: "Done" },
  { id: "4", title: "Chemistry worksheet", completed: false, priority: "low", subject: "AP Chemistry", dueTime: "Feb 12" },
  { id: "5", title: "Code binary search tree", completed: true, priority: "medium", subject: "AP Computer Sci", dueTime: "Done" },
  { id: "6", title: "History DBQ outline", completed: false, priority: "high", subject: "AP US History", dueTime: "Today 8PM" },
];

export interface CollegeApplication {
  id: string;
  collegeName: string;
  location: string;
  deadline: string;
  status: "not_started" | "in_progress" | "submitted" | "accepted" | "rejected" | "waitlisted";
  likelihood: number;
  image: string;
  major: string;
  essaysCompleted: number;
  essaysTotal: number;
  supplementsCompleted: number;
  supplementsTotal: number;
  recommenders: { name: string; status: "requested" | "submitted" | "pending" }[];
  selectivity: "reach" | "target" | "safety";
  scholarshipPotential: boolean;
}

export interface Essay {
  id: string;
  title: string;
  college: string;
  wordCount: number;
  wordLimit: number;
  status: "draft" | "review" | "final";
  lastEdited: string;
  type: "personal" | "supplement" | "short_answer";
}

export interface ActivityEntry {
  id: string;
  title: string;
  organization: string;
  role: string;
  yearsActive: string;
  hoursPerWeek: number;
  weeksPerYear: number;
  category: string;
  description: string;
  impact: string;
  priority: number;
}

export interface Honor {
  id: string;
  title: string;
  level: "school" | "regional" | "state" | "national" | "international";
  issuer: string;
  year: string;
  description: string;
}

export const collegeApplications: CollegeApplication[] = [
  {
    id: "1", collegeName: "MIT", location: "Cambridge, MA", deadline: "Jan 1, 2027",
    status: "in_progress", likelihood: 34, image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=250&fit=crop",
    major: "Computer Science", essaysCompleted: 2, essaysTotal: 3, supplementsCompleted: 1, supplementsTotal: 2,
    recommenders: [{ name: "Dr. Williams", status: "submitted" }, { name: "Ms. Lee", status: "requested" }],
    selectivity: "reach", scholarshipPotential: true,
  },
  {
    id: "2", collegeName: "Stanford University", location: "Stanford, CA", deadline: "Jan 2, 2027",
    status: "in_progress", likelihood: 28, image: "https://images.unsplash.com/photo-1584598111372-54ccf343a3af?w=400&h=250&fit=crop",
    major: "Computer Science", essaysCompleted: 1, essaysTotal: 4, supplementsCompleted: 0, supplementsTotal: 3,
    recommenders: [{ name: "Dr. Williams", status: "submitted" }, { name: "Mr. Chen", status: "pending" }],
    selectivity: "reach", scholarshipPotential: false,
  },
  {
    id: "3", collegeName: "Georgia Tech", location: "Atlanta, GA", deadline: "Jan 4, 2027",
    status: "submitted", likelihood: 72, image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop",
    major: "Computer Engineering", essaysCompleted: 2, essaysTotal: 2, supplementsCompleted: 1, supplementsTotal: 1,
    recommenders: [{ name: "Dr. Williams", status: "submitted" }, { name: "Ms. Lee", status: "submitted" }],
    selectivity: "target", scholarshipPotential: true,
  },
  {
    id: "4", collegeName: "UC Berkeley", location: "Berkeley, CA", deadline: "Nov 30, 2026",
    status: "submitted", likelihood: 55, image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&h=250&fit=crop",
    major: "EECS", essaysCompleted: 4, essaysTotal: 4, supplementsCompleted: 2, supplementsTotal: 2,
    recommenders: [{ name: "Mr. Chen", status: "submitted" }, { name: "Ms. Parker", status: "submitted" }],
    selectivity: "target", scholarshipPotential: false,
  },
  {
    id: "5", collegeName: "University of Michigan", location: "Ann Arbor, MI", deadline: "Feb 1, 2027",
    status: "not_started", likelihood: 68, image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=250&fit=crop",
    major: "Computer Science", essaysCompleted: 0, essaysTotal: 3, supplementsCompleted: 0, supplementsTotal: 2,
    recommenders: [{ name: "Dr. Williams", status: "pending" }],
    selectivity: "target", scholarshipPotential: true,
  },
  {
    id: "6", collegeName: "Purdue University", location: "West Lafayette, IN", deadline: "Jan 15, 2027",
    status: "accepted", likelihood: 89, image: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=400&h=250&fit=crop",
    major: "Computer Science", essaysCompleted: 2, essaysTotal: 2, supplementsCompleted: 1, supplementsTotal: 1,
    recommenders: [{ name: "Dr. Williams", status: "submitted" }, { name: "Ms. Lee", status: "submitted" }],
    selectivity: "safety", scholarshipPotential: true,
  },
];

export const essays: Essay[] = [
  { id: "1", title: "Personal Statement", college: "Common App", wordCount: 587, wordLimit: 650, status: "review", lastEdited: "2h ago", type: "personal" },
  { id: "2", title: "Why MIT?", college: "MIT", wordCount: 210, wordLimit: 250, status: "draft", lastEdited: "1d ago", type: "supplement" },
  { id: "3", title: "Community Impact", college: "Stanford", wordCount: 0, wordLimit: 250, status: "draft", lastEdited: "3d ago", type: "supplement" },
  { id: "4", title: "Why Georgia Tech?", college: "Georgia Tech", wordCount: 248, wordLimit: 250, status: "final", lastEdited: "5d ago", type: "supplement" },
  { id: "5", title: "Intellectual Curiosity", college: "Stanford", wordCount: 120, wordLimit: 250, status: "draft", lastEdited: "2d ago", type: "short_answer" },
  { id: "6", title: "Personal Insight Q1", college: "UC Berkeley", wordCount: 350, wordLimit: 350, status: "final", lastEdited: "1w ago", type: "supplement" },
];

export const activities: ActivityEntry[] = [
  { id: "1", title: "Robotics Club", organization: "Westfield Academy", role: "President & Lead Engineer", yearsActive: "9–12", hoursPerWeek: 12, weeksPerYear: 40, category: "STEM", description: "Led team of 15 to design and build competition robots", impact: "Won regional championship 2 years", priority: 1 },
  { id: "2", title: "Math Tutoring", organization: "Community Learning Center", role: "Lead Tutor", yearsActive: "10–12", hoursPerWeek: 6, weeksPerYear: 36, category: "Community Service", description: "Tutored underprivileged students in algebra and geometry", impact: "Helped 40+ students improve grades by 1 letter", priority: 2 },
  { id: "3", title: "Varsity Cross Country", organization: "Westfield Academy", role: "Team Captain", yearsActive: "9–12", hoursPerWeek: 15, weeksPerYear: 30, category: "Athletics", description: "Competed at varsity level, led team workouts", impact: "All-conference honors, team placed 3rd at state", priority: 3 },
  { id: "4", title: "Independent Research", organization: "University Lab Partnership", role: "Research Intern", yearsActive: "11–12", hoursPerWeek: 8, weeksPerYear: 20, category: "Research", description: "Investigated machine learning applications in medical imaging", impact: "Co-authored research paper submitted to journal", priority: 4 },
  { id: "5", title: "Student Government", organization: "Westfield Academy", role: "Vice President", yearsActive: "10–12", hoursPerWeek: 5, weeksPerYear: 36, category: "Leadership", description: "Organized school events and represented student body", impact: "Implemented recycling program saving $5k/year", priority: 5 },
];

export const honors: Honor[] = [
  { id: "1", title: "National Merit Semifinalist", level: "national", issuer: "National Merit Scholarship Corp", year: "2026", description: "Scored in top 1% on PSAT" },
  { id: "2", title: "AP Scholar with Distinction", level: "national", issuer: "College Board", year: "2026", description: "Earned 3+ on five or more AP exams with avg 3.5+" },
  { id: "3", title: "First Place — Regional Science Olympiad", level: "regional", issuer: "Science Olympiad", year: "2025", description: "Won experimental design event" },
  { id: "4", title: "Principal's Honor Roll", level: "school", issuer: "Westfield Academy", year: "2024–2026", description: "Maintained 3.8+ GPA for 4 consecutive semesters" },
];

export const habits: Habit[] = [
  { id: "1", name: "Read 30 min", streak: 12, target: 7, completed: 5, color: "#9F8CF7", icon: "book-open" },
  { id: "2", name: "Practice Math", streak: 8, target: 7, completed: 6, color: "#22D3A7", icon: "calculator" },
  { id: "3", name: "Review Notes", streak: 5, target: 7, completed: 4, color: "#5B9CF6", icon: "file-text" },
  { id: "4", name: "Exercise", streak: 15, target: 7, completed: 7, color: "#F59E42", icon: "activity" },
];
