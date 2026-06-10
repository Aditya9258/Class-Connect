import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Navbar from './sections/Navbar';
import ScrollSequence from './components/ScrollSequence';
import Process from './sections/Process';
import Portfolio from './sections/Portfolio';
import Services from './sections/Services';
import Team from './sections/Team';
import Testimonials from './sections/Testimonials';
import Clients from './sections/Clients';
import Blog from './sections/Blog';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import CursorTrail from './components/CursorTrail';
import AboutUs from './pages/AboutUs';
import StudentDashboard from './pages/StudentDashboard';
import Certificates from './pages/Certificates';
import ClassCourse from './pages/ClassCourse';
import StudentFees from './pages/StudentFees';
import Educator from './pages/Educator';
import EducatorDashboard from './pages/EducatorDashboard';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Complaints from './pages/Complaints';
import Registration from './pages/Registration';
import AdditionalExamFee from './pages/AdditionalExamFee';
import HallAdmitCard from './pages/HallAdmitCard';
import GradeCardResult from './pages/GradeCardResult';
import AttendanceReport from './pages/AttendanceReport';
import CompetitiveAnalysis from './pages/CompetitiveAnalysis';
import PerformanceAnalysis from './pages/PerformanceAnalysis';


gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  return (
    <main>
      <ScrollSequence />
      <Process />
      <Portfolio />
      <Services />
      <Team />
      <Testimonials />
      <Clients />
      <Blog />
      <CTA />
    </main>
  );
}

/* Scroll to top + refresh ScrollTrigger on route change */
function ScrollToTop({ lenis }: { lenis: Lenis | null }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    // Kill ALL stale ScrollTrigger instances from the previous page first,
    // then give the DOM one frame to render before refreshing positions.
    // This prevents ghost pin-spacer divs from blocking pointer events.
    ScrollTrigger.getAll().forEach((t) => t.kill());
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [pathname, lenis]);

  return null;
}

function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/educator-dashboard') || location.pathname.includes('/admin-dashboard') || location.pathname.includes('/login/administrator');

  useEffect(() => {
    // Disable Lenis smooth scrolling on dashboards since they use their own internal scroll containers
    if (isDashboard) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isDashboard]); // Re-run if we enter/leave dashboard

  return (
    <div className="relative">
      <ScrollToTop lenis={lenisRef.current} />
      
      {!isDashboard && <CursorTrail />}
      {!isDashboard && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/administrator/778899" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/certificates" element={<Certificates />} />
        <Route path="/student/class-course" element={<ClassCourse />} />
        <Route path="/student/fees" element={<StudentFees />} />
        <Route path="/student/complaints" element={<Complaints />} />
        <Route path="/student/examination/registration" element={<Registration />} />
        <Route path="/student/examination/exam-fee" element={<AdditionalExamFee />} />
        <Route path="/student/examination/admit-card" element={<HallAdmitCard />} />
        <Route path="/student/examination/grade-card" element={<GradeCardResult />} />
        <Route path="/student/analysis/attendance" element={<AttendanceReport />} />
        <Route path="/student/analysis/competitive" element={<CompetitiveAnalysis />} />
        <Route path="/student/analysis/performance" element={<PerformanceAnalysis />} />
        <Route path="/educator" element={<Educator />} />
        <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      
      {!isDashboard && <Footer />}
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
