import {
   TbLayoutDashboard,
  TbBriefcase,
  TbPlus,
  TbPackage,
  TbHistory,
  TbUser,
   TbChartLine,
   TbUserCheck,
   TbDeviceLaptop,
   TbCurrencyRupee,
} from 'react-icons/tb'

export const NAV_ITEMS = [
  // { section: 'Main' },
  { id: 'dashboard', label: 'Dashboard', icon: TbLayoutDashboard, path: '/' },
  { id: 'jobs', label: 'Job Listings', icon: TbBriefcase, path: '/jobs' },
  { id: 'job-post', label: 'Post Job', icon: TbPlus, path: '/job-post' },
  { id: 'subscription-package', label: 'Subscription Packages', icon: TbPackage, path: '/subscription-package' },
  { id: 'subscription-history', label: 'Subscription History', icon: TbHistory, path: '/subscription-history' },

  // { id: 'jobs', label: 'Job Listings', icon: TbBriefcase, path: '/jobs', badge: '12' },

  // { id: 'candidates', label: 'Candidates', icon: TbUsers, path: '/candidates' },
  // { id: 'companies', label: 'Companies', icon: TbBuilding, path: '/companies' },
  // { section: 'Recruitment' },
  // { id: 'applications', label: 'Applications', icon: TbFileText, path: '/applications', badge: '5', badgeRed: true },
  // { id: 'interviews', label: 'Interviews', icon: TbCalendarEvent, path: '/interviews' },
  // { id: 'messages', label: 'Messages', icon: TbMessageCircle, path: '/messages', badge: '3' },
  // { section: 'Settings' },
  // { id: 'settings', label: 'Settings', icon: TbSettings, path: '/settings' },
  // { id: 'reports', label: 'Reports', icon: TbChartBar, path: '/reports' },
  // { section: 'Account' },
  { id: 'profile', label: 'Profile', icon: TbUser, path: '/profile' },
]

// ── Welcome banner ──
export const WELCOME = {
  name: 'Admin',
  message: 'Best recruiter of the month',
  value: '142',
  valueLabel: 'placements',
}

// ── Top "Statistics Card" row ──
export const STATISTICS = [
  { icon: TbChartLine, color: 'brand', label: 'Jobs Posted', val: '248' },
  { icon: TbUserCheck, color: 'success', label: 'Candidates', val: '3.8k' },
  { icon: TbDeviceLaptop, color: 'warn', label: 'Companies', val: '142' },
  { icon: TbCurrencyRupee, color: 'info', label: 'Revenue', val: '₹88k' },
]

// ── Weekly overview ──
export const WEEKLY_OVERVIEW = {
  percent: 45,
  message: "Your hiring performance is 45% better compared to last month",
}

// ── Total earning card → "Total Hires" with company breakdown ──
export const TOTAL_HIRES = {
  value: '24,895',
  change: '10%',
  compareText: 'Compared to 18,325 last year',
  companies: [
    { name: 'TechCorp India', sub: 'React, Node & MongoDB', val: '34 hires', progress: 78, color: '#8C57FF' },
    { name: 'StartupX', sub: 'Product & Design', val: '21 hires', progress: 55, color: '#16B1FF' },
    { name: 'CloudBase', sub: 'DevOps & Cloud', val: '9 hires', progress: 22, color: '#56CA00' },
  ],
}

// ── 4 mini stat cards (profit/refunds/new project/sales queries equivalent) ──
export const MINI_STATS = [
  { icon: 'chart', iconBg: 'bg-success-500', label: 'Total Placements', val: '186', change: '+42%', up: true, sub: 'This Month' },
  { icon: 'dollar', iconBg: 'bg-gray-400', label: 'Withdrawn Jobs', val: '12', change: '-15%', up: false, sub: 'Past Month' },
  { icon: 'briefcase', iconBg: 'bg-brand-500', label: 'New Job Posts', val: '34', change: '+18%', up: true, sub: 'This Week' },
  { icon: 'help', iconBg: 'bg-warn-500', label: 'Support Queries', val: '9', change: '-18%', up: false, sub: 'Last Week' },
]

// ── "Sales by Countries" equivalent → Candidates by location ──
export const LOCATIONS = [
  { code: 'AH', name: 'Ahmedabad', candidates: '856', percent: '25.8%', jobs: '94' },
  { code: 'MU', name: 'Mumbai', candidates: '415', percent: '16.2%', jobs: '65' },
  { code: 'BE', name: 'Bengaluru', candidates: '865', percent: '22.4%', jobs: '148' },
  { code: 'PU', name: 'Pune', candidates: '345', percent: '11.9%', jobs: '46' },
  { code: 'HY', name: 'Hyderabad', candidates: '245', percent: '9.2%', jobs: '42' },
]

// ── "Deposit / Withdraw" equivalent → New Applications / Closed Jobs ──
export const NEW_APPLICATIONS = [
  { name: 'Arjun Mehta', sub: 'Senior React Developer', value: 'New', color: 'bg-brand-50 text-brand-600', initials: 'AM' },
  { name: 'Priya Shah', sub: 'Product Manager', value: 'Shortlisted', color: 'bg-success-50 text-success-700', initials: 'PS' },
  { name: 'Rohan Patel', sub: 'DevOps Engineer', value: 'New', color: 'bg-brand-50 text-brand-600', initials: 'RP' },
  { name: 'Neha Gupta', sub: 'UX Designer', value: 'Interview', color: 'bg-info-50 text-info-700', initials: 'NG' },
  { name: 'Vikram Singh', sub: 'Data Scientist', value: 'New', color: 'bg-brand-50 text-brand-600', initials: 'VS' },
]

export const CLOSED_JOBS = [
  { name: 'Data Scientist', sub: 'AnalyticsCo', value: '-Closed', initials: 'DS' },
  { name: 'Backend Engineer', sub: 'FintechPro', value: '-Filled', initials: 'BE' },
  { name: 'Marketing Lead', sub: 'GrowthCo', value: '-Closed', initials: 'ML' },
  { name: 'QA Engineer', sub: 'TestWorks', value: '-Filled', initials: 'QA' },
  { name: 'HR Manager', sub: 'PeopleFirst', value: '-Closed', initials: 'HR' },
]

// ── Job listings (used in dashboard bottom table + Jobs page) ──
export const JOBS = [
  { id: 1, title: 'Senior React Developer', company: 'TechCorp India', location: 'Ahmedabad, GJ', type: 'Full-time', salary: '₹18-25 LPA', apps: 34, status: 'active', posted: '2 days ago' },
  { id: 2, title: 'Product Manager', company: 'StartupX', location: 'Remote', type: 'Remote', salary: '₹20-28 LPA', apps: 21, status: 'active', posted: '4 days ago' },
  { id: 3, title: 'UI/UX Designer', company: 'DesignHub', location: 'Mumbai, MH', type: 'Full-time', salary: '₹12-18 LPA', apps: 15, status: 'pending', posted: '1 week ago' },
  { id: 4, title: 'DevOps Engineer', company: 'CloudBase', location: 'Bengaluru, KA', type: 'Full-time', salary: '₹22-30 LPA', apps: 9, status: 'active', posted: '3 days ago' },
  { id: 5, title: 'Data Scientist', company: 'AnalyticsCo', location: 'Hyderabad, TS', type: 'Hybrid', salary: '₹25-35 LPA', apps: 42, status: 'closed', posted: '2 weeks ago' },
  { id: 6, title: 'Backend Engineer', company: 'FintechPro', location: 'Pune, MH', type: 'Full-time', salary: '₹15-22 LPA', apps: 18, status: 'active', posted: '5 days ago' },
  { id: 7, title: 'Marketing Lead', company: 'GrowthCo', location: 'Delhi, DL', type: 'Full-time', salary: '₹16-22 LPA', apps: 27, status: 'pending', posted: '6 days ago' },
  { id: 8, title: 'QA Engineer', company: 'TestWorks', location: 'Chennai, TN', type: 'Full-time', salary: '₹10-15 LPA', apps: 11, status: 'active', posted: '1 day ago' },
]

export const CANDIDATES = [
  { id: 1, name: 'Arjun Mehta', role: 'React Developer', exp: '4 yrs', location: 'Ahmedabad', status: 'active', applied: 8, avatar: 'AM' },
  { id: 2, name: 'Priya Shah', role: 'Product Manager', exp: '6 yrs', location: 'Mumbai', status: 'pending', applied: 3, avatar: 'PS' },
  { id: 3, name: 'Rohan Patel', role: 'DevOps Engineer', exp: '3 yrs', location: 'Bengaluru', status: 'active', applied: 5, avatar: 'RP' },
  { id: 4, name: 'Neha Gupta', role: 'UX Designer', exp: '5 yrs', location: 'Delhi', status: 'active', applied: 12, avatar: 'NG' },
  { id: 5, name: 'Vikram Singh', role: 'Data Scientist', exp: '7 yrs', location: 'Hyderabad', status: 'rejected', applied: 2, avatar: 'VS' },
]

export const MESSAGES = [
  { id: 1, name: 'Arjun Mehta', text: "Hi, I'd like to apply for the React Developer role.", time: '10:24 AM', unread: true, avatar: 'AM' },
  { id: 2, name: 'Priya Shah', text: 'Can you share more details about the salary structure?', time: '9:10 AM', unread: true, avatar: 'PS' },
  { id: 3, name: 'TechCorp HR', text: 'We reviewed the shortlisted candidates.', time: 'Yesterday', unread: false, avatar: 'TC' },
  { id: 4, name: 'Rohan Patel', text: 'Is the position still open for applications?', time: 'Yesterday', unread: true, avatar: 'RP' },
  { id: 5, name: 'StartupX', text: 'Interview scheduled for Friday 3 PM.', time: 'Mon', unread: false, avatar: 'SX' },
]

export const NOTIFICATIONS = [
  { msg: 'New application received for Senior React Developer', time: '2 min ago', unread: true },
  { msg: "Company 'FintechPro' submitted verification documents", time: '30 min ago', unread: true },
  { msg: '5 candidates flagged for review', time: '2 hrs ago', unread: true },
  { msg: 'Monthly report for May 2026 is ready', time: 'Yesterday', unread: false },
  { msg: 'Priya Shah accepted the interview invite', time: 'Yesterday', unread: false },
]
