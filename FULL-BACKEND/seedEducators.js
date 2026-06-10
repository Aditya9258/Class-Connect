const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');
const EducatorProfile = require('./models/EducatorProfile');

const educatorsData = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@vidyalaya.edu.in',
    password: 'Physics@2026!',
    role: 'educator',
    profile: {
      subjectSpecialization: 'Physics',
      dateOfBirth: new Date('1988-08-15'),
      aadhaarNumber: '4321-8765-0912',
      mobileNumber: '+91 9876543210',
      residentialAddress: '45-A, Sunrise Apartments, M.G. Road, Agra, Uttar Pradesh 282001',
      highestQualification: 'M.Sc. Physics (or B.Ed.)',
      qualificationDocument: 'rajesh_degree_certificate.pdf',
      salary: 65000
    }
  },
  {
    name: 'Priya Sharma',
    email: 'p.sharma@vidyalaya.edu.in',
    password: 'MathWizard#92',
    role: 'educator',
    profile: {
      subjectSpecialization: 'Mathematics',
      dateOfBirth: new Date('1992-11-04'),
      aadhaarNumber: '1234-5678-9012',
      mobileNumber: '+91 9123456789',
      residentialAddress: 'Flat 203, Block B, Green Valley Enclave, Sikandra, Agra, UP 282007',
      highestQualification: 'M.Sc. Mathematics, B.Ed.',
      qualificationDocument: 'priya_sharma_msc_bed.pdf',
      salary: 55000
    }
  },
  {
    name: 'Anita Desai',
    email: 'anita.desai@vidyalaya.edu.in',
    password: 'LitLover@1985',
    role: 'educator',
    profile: {
      subjectSpecialization: 'English Literature',
      dateOfBirth: new Date('1985-05-22'),
      aadhaarNumber: '9876-5432-1098',
      mobileNumber: '+91 9988776655',
      residentialAddress: '12, Civil Lines, Near St. John\'s College, Agra, UP 282002',
      highestQualification: 'M.A. English',
      qualificationDocument: 'adesai_ma_eng_cert.pdf',
      salary: 60000
    }
  },
  {
    name: 'Dr. Sangeeta Verma',
    email: 'dr.sangeeta@vidyalaya.edu.in',
    password: 'BioScience$80',
    role: 'educator',
    profile: {
      subjectSpecialization: 'Biology',
      dateOfBirth: new Date('1980-02-18'),
      aadhaarNumber: '3456-7890-1234',
      mobileNumber: '+91 7766554433',
      residentialAddress: 'Plot 45, Tajganj, Agra, UP 282001',
      highestQualification: 'Ph.D. Zoology',
      qualificationDocument: 'sverma_phd_transcript.pdf',
      salary: 85000
    }
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.s@vidyalaya.edu.in',
    password: 'CodeMaster!2026',
    role: 'educator',
    profile: {
      subjectSpecialization: 'Computer Science',
      dateOfBirth: new Date('1995-09-10'),
      aadhaarNumber: '4567-8901-2345',
      mobileNumber: '+91 8877665544',
      residentialAddress: '89/A, Kamla Nagar, Agra, UP 282004',
      highestQualification: 'MCA',
      qualificationDocument: 'vikram_mca_degree.pdf',
      salary: 70000
    }
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    for (const ed of educatorsData) {
      let user = await User.findOne({ email: ed.email });
      if (!user) {
        user = await User.create({
          name: ed.name,
          email: ed.email,
          password: ed.password,
          role: ed.role
        });
        console.log(`Created user: ${ed.name}`);
      } else {
        console.log(`User already exists: ${ed.name}`);
      }

      let profile = await EducatorProfile.findOne({ user: user._id });
      if (!profile) {
        await EducatorProfile.create({
          user: user._id,
          ...ed.profile
        });
        console.log(`Created profile for: ${ed.name}`);
      } else {
        await EducatorProfile.updateOne({ user: user._id }, { $set: ed.profile });
        console.log(`Updated profile for: ${ed.name}`);
      }
    }
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit();
  }
});
