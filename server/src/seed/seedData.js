const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Interview = require('../models/Interview');
const Note = require('../models/Note');
const Notification = require('../models/Notification');

const seedData = async (shouldConnect = true) => {
  try {
    if (shouldConnect) {
      const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-tracker';
      await mongoose.connect(uri);
      console.log('✅ Connected to MongoDB for seeding');
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Company.deleteMany({}),
      Interview.deleteMany({}),
      Note.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo1234',
    });
    console.log('👤 Created demo user (demo@example.com / demo1234)');

    // Create target companies with rich research & culture notes
    const companies = await Company.insertMany([
      {
        name: 'Google',
        website: 'https://careers.google.com',
        industry: 'Search & Cloud AI',
        location: 'Mountain View, CA',
        rating: 5,
        notes: 'Top tier engineering culture. 5 round onsite including 2 system design & 3 coding. High compensation (L5 TC ~ $350k). Good work-life balance.',
        user: user._id,
      },
      {
        name: 'OpenAI',
        website: 'https://openai.com/careers',
        industry: 'Artificial Intelligence',
        location: 'San Francisco, CA',
        rating: 5,
        notes: 'Building AGI. Extremely competitive technical interviews. High equity grants. Focus on LLM infrastructure, alignment, and systems engineering.',
        user: user._id,
      },
      {
        name: 'NVIDIA',
        website: 'https://nvidia.com/careers',
        industry: 'Hardware & AI Computing',
        location: 'Santa Clara, CA',
        rating: 5,
        notes: 'Leader in GPU computing & CUDA software stack. Fast growing team. Great culture for systems developers and deep learning hardware specialists.',
        user: user._id,
      },
      {
        name: 'Meta',
        website: 'https://meta.com/careers',
        industry: 'Social Media & VR/AR',
        location: 'Menlo Park, CA',
        rating: 4,
        notes: 'Fast paced execution. Heavy focus on product engineering (React/Relay/GraphQL). Strong compensation and stock appreciation.',
        user: user._id,
      },
      {
        name: 'Apple',
        website: 'https://apple.com/jobs',
        industry: 'Consumer Electronics & Software',
        location: 'Cupertino, CA',
        rating: 5,
        notes: 'Unmatched product quality and design standards. Hardware & OS integration. Team-dependent wlb, high security & secrecy culture.',
        user: user._id,
      },
      {
        name: 'Microsoft',
        website: 'https://careers.microsoft.com',
        industry: 'Cloud & Enterprise Software',
        location: 'Redmond, WA',
        rating: 5,
        notes: 'Azure cloud expansion. Great benefits, parental leave, and work-life balance. Hybrid work flexible. Stack: C#, .NET, TypeScript.',
        user: user._id,
      },
      {
        name: 'Netflix',
        website: 'https://jobs.netflix.com',
        industry: 'Streaming & Media Tech',
        location: 'Los Gatos, CA',
        rating: 5,
        notes: 'Freedom & Responsibility culture. Top of market cash compensation (all cash option). High bar for senior/staff talent.',
        user: user._id,
      },
      {
        name: 'Stripe',
        website: 'https://stripe.com/jobs',
        industry: 'Fintech Payments',
        location: 'San Francisco, CA (Remote)',
        rating: 5,
        notes: 'Exceptional API design standards and technical writing culture. Ruby/Go infrastructure. Remote-first engineering teams.',
        user: user._id,
      },
      {
        name: 'Amazon',
        website: 'https://amazon.jobs',
        industry: 'E-Commerce & AWS',
        location: 'Seattle, WA',
        rating: 4,
        notes: 'AWS drives industry cloud infra. 16 Leadership Principles heavily tested during Bar Raiser interviews. Fast-paced environment.',
        user: user._id,
      },
      {
        name: 'Uber',
        website: 'https://uber.com/careers',
        industry: 'Mobility & Logistics',
        location: 'San Francisco, CA',
        rating: 4,
        notes: 'Distributed systems at immense scale (Go, Microservices, Kafka). High performance engineering culture.',
        user: user._id,
      },
      {
        name: 'Airbnb',
        website: 'https://careers.airbnb.com',
        industry: 'Travel Tech',
        location: 'San Francisco, CA (Live & Work Anywhere)',
        rating: 5,
        notes: 'Work from anywhere policy! World class UI/UX design system. Strong employee perks & travel credits.',
        user: user._id,
      },
      {
        name: 'Spotify',
        website: 'https://lifeatspotify.com',
        industry: 'Audio & Music Streaming',
        location: 'Stockholm & NYC',
        rating: 4,
        notes: 'Squad framework & agile culture. Great music perks, flexible work options, and collaborative international team.',
        user: user._id,
      },
      {
        name: 'Databricks',
        website: 'https://databricks.com/company/careers',
        industry: 'Data & Lakehouse Platform',
        location: 'San Francisco, CA',
        rating: 5,
        notes: 'Pre-IPO hypergrowth data company. Creators of Apache Spark. High equity upside and cutting-edge data infra technology.',
        user: user._id,
      },
      {
        name: 'Palantir',
        website: 'https://palantir.com/careers',
        industry: 'Defense & Data Analytics',
        location: 'Denver, CO',
        rating: 4,
        notes: 'Foundry & Gotham platforms. Deployed Engineer roles. Intense problem solving and complex data pipelines.',
        user: user._id,
      },
      {
        name: 'ByteDance',
        website: 'https://jobs.bytedance.com',
        industry: 'Short Video & Content AI',
        location: 'San Jose, CA',
        rating: 4,
        notes: 'TikTok recommendation engines. Rapid prototyping, massive data scaling, and competitive base salaries.',
        user: user._id,
      },
      {
        name: 'Snowflake',
        website: 'https://snowflake.com/careers',
        industry: 'Cloud Data Warehouse',
        location: 'Bozeman, MT / Remote',
        rating: 4,
        notes: 'Multi-cloud data warehousing. Heavy C++ and SQL engine internal optimization.',
        user: user._id,
      },
    ]);
    console.log(`🏢 Created ${companies.length} target companies`);

    // Create jobs linked to companies
    const now = new Date();
    const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
    const daysFromNow = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

    const jobs = await Job.insertMany([
      { company: 'Google', position: 'Senior Frontend Engineer', status: 'Interview', type: 'Full-time', location: 'Mountain View, CA', remote: false, salary: '$180k - $250k', url: 'https://careers.google.com', appliedDate: daysAgo(14), deadline: daysFromNow(7), user: user._id, tags: ['React', 'TypeScript', 'L5'] },
      { company: 'OpenAI', position: 'Full Stack Engineer - ChatGPT', status: 'Interview', type: 'Full-time', location: 'San Francisco, CA', remote: true, salary: '$220k - $320k', url: 'https://openai.com/careers', appliedDate: daysAgo(5), deadline: daysFromNow(10), user: user._id, tags: ['Python', 'TypeScript', 'LLM'] },
      { company: 'NVIDIA', position: 'System Software Engineer - CUDA', status: 'OA', type: 'Full-time', location: 'Santa Clara, CA', remote: false, salary: '$190k - $270k', appliedDate: daysAgo(8), user: user._id, tags: ['C++', 'CUDA', 'GPU'] },
      { company: 'Meta', position: 'Software Engineer, Product', status: 'OA', type: 'Full-time', location: 'Menlo Park, CA', remote: true, salary: '$170k - $240k', url: 'https://careers.meta.com', appliedDate: daysAgo(10), user: user._id, tags: ['React', 'GraphQL'] },
      { company: 'Amazon', position: 'SDE II - AWS Cloud', status: 'Applied', type: 'Full-time', location: 'Seattle, WA', remote: false, salary: '$160k - $230k', appliedDate: daysAgo(3), deadline: daysFromNow(14), user: user._id, tags: ['Java', 'AWS'] },
      { company: 'Netflix', position: 'Full Stack Developer', status: 'Offer', type: 'Full-time', location: 'Los Gatos, CA', remote: true, salary: '$200k - $300k', appliedDate: daysAgo(30), user: user._id, tags: ['Node.js', 'React'] },
      { company: 'Microsoft', position: 'Software Engineer - Azure', status: 'Interview', type: 'Full-time', location: 'Redmond, WA', remote: false, salary: '$150k - $210k', appliedDate: daysAgo(7), deadline: daysFromNow(5), user: user._id, tags: ['C#', '.NET'] },
      { company: 'Apple', position: 'iOS Developer', status: 'Rejected', type: 'Full-time', location: 'Cupertino, CA', remote: false, salary: '$175k - $250k', appliedDate: daysAgo(25), user: user._id, tags: ['Swift', 'iOS'] },
      { company: 'Stripe', position: 'Backend Engineer - Infrastructure', status: 'Applied', type: 'Full-time', location: 'San Francisco, CA', remote: true, salary: '$185k - $260k', appliedDate: daysAgo(2), user: user._id, tags: ['Ruby', 'Go'] },
      { company: 'Spotify', position: 'Data Engineer - Recommendations', status: 'OA', type: 'Full-time', location: 'Stockholm, Sweden', remote: true, salary: '€80k - €120k', appliedDate: daysAgo(8), user: user._id, tags: ['Python', 'Spark'] },
      { company: 'Airbnb', position: 'Staff Frontend Engineer', status: 'Applied', type: 'Full-time', location: 'San Francisco, CA', remote: true, salary: '$210k - $310k', appliedDate: daysAgo(4), user: user._id, tags: ['Design System', 'React'] },
      { company: 'Databricks', position: 'Backend Distributed Systems Engineer', status: 'Applied', type: 'Full-time', location: 'San Francisco, CA', remote: false, salary: '$195k - $280k', appliedDate: daysAgo(1), user: user._id, tags: ['Scala', 'Spark'] },
    ]);
    console.log(`💼 Created ${jobs.length} job applications`);

    // Create interviews
    const interviews = await Interview.insertMany([
      { job: jobs[0]._id, type: 'Technical', date: daysFromNow(3), location: 'Google HQ', notes: 'System design round - prepare distributed systems concepts', status: 'Scheduled', user: user._id },
      { job: jobs[0]._id, type: 'Behavioral', date: daysFromNow(5), link: 'https://meet.google.com/abc', notes: 'STAR method - prepare leadership stories', status: 'Scheduled', user: user._id },
      { job: jobs[1]._id, type: 'Technical', date: daysFromNow(4), link: 'https://zoom.us/j/999', notes: 'Full stack live coding - ChatGPT integration case study', status: 'Scheduled', user: user._id },
      { job: jobs[6]._id, type: 'Phone', date: daysFromNow(2), link: 'https://teams.microsoft.com/xyz', notes: 'Initial phone screen with hiring manager', status: 'Scheduled', user: user._id },
      { job: jobs[5]._id, type: 'Onsite', date: daysAgo(5), location: 'Netflix Office', notes: 'Final round - went well, discussed culture memo', status: 'Completed', user: user._id },
    ]);
    console.log(`🎤 Created ${interviews.length} interviews`);

    // Create notes
    await Note.insertMany([
      { job: jobs[0]._id, content: 'Researched Google L5 interview process. Focus on system design and coding. Typical 5-round onsite.', type: 'Research', user: user._id },
      { job: jobs[0]._id, content: 'Practice: Design a URL shortener, Design Google Docs real-time collaboration.', type: 'Interview Prep', user: user._id },
      { job: jobs[1]._id, content: 'OpenAI interview prep: Read papers on Transformer architectures and Streaming API responses.', type: 'Interview Prep', user: user._id },
      { job: jobs[5]._id, content: 'Received offer! TC: $285k. Need to respond by next Friday.', type: 'General', user: user._id },
      { job: jobs[6]._id, content: 'Follow up with recruiter about interview timeline.', type: 'Follow-up', user: user._id },
    ]);
    console.log('📝 Created notes');

    // Create notifications
    await Notification.insertMany([
      { user: user._id, title: 'Interview Reminder', message: 'Technical interview with Google in 3 days', type: 'interview', job: jobs[0]._id },
      { user: user._id, title: 'OpenAI Round Scheduled', message: 'Full stack technical interview scheduled for OpenAI', type: 'interview', job: jobs[1]._id },
      { user: user._id, title: 'Deadline Approaching', message: 'Application deadline for Amazon SDE II in 14 days', type: 'deadline', job: jobs[4]._id },
      { user: user._id, title: 'Offer Received! 🎉', message: 'Congratulations! You received an offer from Netflix', type: 'status', job: jobs[5]._id, read: true },
    ]);
    console.log('🔔 Created notifications');

    console.log('\n🎉 Seed data created successfully!');
    console.log('📧 Login: demo@example.com');
    console.log('🔑 Password: demo1234\n');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seed error:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData();
}

