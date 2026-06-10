import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Download, Calendar, CheckCircle2, Activity, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

interface FeeTimelineItem {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UPCOMING' | 'PENDING';
  payDate?: string;
  receiptId?: string;
  payMethod?: string;
}

const getStudentClass = (courseStr: string) => {
  if (!courseStr) return '';
  const match = courseStr.match(/Class\s*(\d+)/i);
  if (match) return match[1];
  const parts = courseStr.split('-');
  if (parts.length > 0) return parts[0].trim().replace(/Class/i, '').trim();
  return '';
};

export default function StudentFees() {
  const { user, isLoading } = useAuth();
  const headerRef = useRef<HTMLDivElement>(null);
  const [timelineItems, setTimelineItems] = useState<FeeTimelineItem[]>([]);
  const [countdown, setCountdown] = useState({ days: 8, hrs: 14, mins: 32, secs: 45 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  const [payFullYear, setPayFullYear] = useState(false);
  
  const getFormattedStudentId = () => {
    const raw = studentProfile?.registrationNo || user?._id || '';
    if (raw.startsWith('STU-')) return raw;
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.length >= 8) return `STU-${digits.substring(0, 8)}`;
    return `STU-${(raw.toUpperCase() + '12345678').replace(/[^0-9A-Z]/g, '').substring(0, 8)}`;
  };
  
  const [totalAssessed, setTotalAssessed] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  const loadData = async () => {
    try {
      const [{ data: studentRes }, { data: dashRes }] = await Promise.all([
        api.get('/student/me').catch(() => ({ data: { data: null } })),
        api.get('/student/dashboard').catch(() => ({ data: { data: { classFees: {}, studentFees: {} } } }))
      ]);

      // Extract the actual student profile, handling possible nested data
      const dbProfile = studentRes?.data || studentRes || {};
      setStudentProfile(dbProfile);

      // Extract dashboard data
      const dashData = dashRes?.data || dashRes || {};
      const classFees = dashData.classFees || {};
      const studentFees = dashData.studentFees || {};

      // Fallback to '10' if course is not set
      const sClass = getStudentClass(dbProfile.course || dbProfile.class || 'Class 10');
      // If classFees is completely empty, provide a sensible default for demonstration
      const assessed = Number(classFees[sClass] || classFees['10'] || 60000);
      const paid = Number((studentFees[dbProfile._id] || {}).paidAmount || 0);

      setTotalAssessed(assessed);
      setTotalPaid(paid);

      const labels = [
        'April Tuition Fee', 'May Tuition Fee', 'June Tuition Fee',
        'July Tuition Fee', 'August Tuition Fee', 'September Tuition Fee', 'October Tuition Fee',
        'November Tuition Fee', 'December Tuition Fee', 'January Tuition Fee', 'February Tuition Fee', 'March Tuition Fee'
      ];

      const monthlyFee = Math.round(assessed / 12);

      let cumulative = 0;
      let upcomingFound = false;

      const generated: FeeTimelineItem[] = labels.map((label, idx) => {
        const amount = idx === 11 ? (assessed - (monthlyFee * 11)) : monthlyFee;
        cumulative += amount;

        let status: 'PAID' | 'UPCOMING' | 'PENDING' = 'PENDING';
        let receiptId = undefined;
        let payDate = undefined;
        let payMethod = undefined;

        if (paid >= cumulative) {
          status = 'PAID';
          const historyRecord = (dbProfile.paymentHistory || []).find((p: any) => p.label === label) || (dbProfile.paymentHistory || []).find((p: any) => p.label === 'Full Year Tuition Fee');
          if (historyRecord) {
             receiptId = historyRecord.receiptId;
             const d = new Date(historyRecord.payDate);
             payDate = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
             payMethod = historyRecord.method;
          } else {
            receiptId = `RF${10000 + idx * 123}`;
            payDate = `10 ${label.split(' ')[0].substring(0, 3)} 2026`;
            payMethod = 'Card';
          }
        } else if (paid > (cumulative - amount)) {
          status = 'UPCOMING';
          upcomingFound = true;
        } else if (!upcomingFound) {
          status = 'UPCOMING';
          upcomingFound = true;
        }

        return {
          id: `T-${idx}`,
          label,
          amount,
          dueDate: `15 ${label.split(' ')[0].substring(0, 3)} 2026`,
          status,
          payDate,
          receiptId,
          payMethod
        };
      });

      setTimelineItems(generated);
    } catch (err) {
      console.error('Failed to load fee data', err);
    }
  };

  useEffect(() => {
    // Wait for auth to finish loading before fetching
    if (isLoading) return;
    loadData();
  }, [isLoading, user]); // Re-run when auth resolves or user changes

  useEffect(() => {
    // GSAP Intro animation
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1,
      });
    });

    // Countdown logic simulation
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hrs > 0) return { ...prev, hrs: prev.hrs - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hrs: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  const totalOutstanding = Math.max(0, totalAssessed - totalPaid);
  const paidPercentage = totalAssessed > 0 ? Math.round((totalPaid / totalAssessed) * 100) : 0;

  const upcomingItem = timelineItems.find((item) => item.status === 'UPCOMING');

  const handlePayNow = () => {
    if (!upcomingItem) return;
    setPayFullYear(false);
    setPaymentCompleted(false);
    setShowCheckout(true);
  };

  const handleProcessPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!upcomingItem) return;
    
    setIsProcessing(true);
    const amountToPay = payFullYear ? totalOutstanding : upcomingItem.amount;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || 'YOUR_TEST_KEY_HERE',
      amount: amountToPay * 100,
      currency: 'INR',
      name: 'Aditya School',
      description: 'Fee Payment',
      handler: async function (_response: any) {
        try {
          const labelStr = payFullYear ? 'Full Year Tuition Fee' : upcomingItem?.label || 'Tuition Fee';
          await api.post('/student/pay-fee', { amount: amountToPay, label: labelStr });
          setPaymentCompleted(true);
          loadData();
          setTimeout(() => {
            setShowCheckout(false);
            setPaymentCompleted(false);
          }, 3000);
        } catch (err: any) {
          console.error(err);
          const errorMsg = err?.response?.data?.message || 'Payment was successful but we failed to update our servers. Please contact admin.';
          toast.error(errorMsg, { duration: 5000 });
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: {
        color: '#D4AF37'
      }
    };

    try {
      if (!(window as any).Razorpay) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`, { duration: 4000 });
        setIsProcessing(false);
      });
      rzp1.open();
    } catch (err) {
      console.error('Razorpay initialization failed:', err);
      toast.error('Failed to open payment gateway.');
      setIsProcessing(false);
    }
  };

  const handleGenerateReceipt = (item: FeeTimelineItem, action: 'view' | 'download') => {
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt #${item.receiptId}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1B1F3B; }
            .receipt-container { max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 20px; }
            .school-name { font-size: 24px; font-weight: 900; margin: 0; color: #D4AF37; }
            .title { font-size: 18px; font-weight: bold; margin: 10px 0 0; color: #1B1F3B; text-transform: uppercase; letter-spacing: 2px; }
            .details { margin-bottom: 30px; line-height: 1.8; font-size: 14px; }
            .details-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #e5e7eb; padding: 12px 0; }
            .label { font-weight: 600; color: #6b7280; }
            .value { font-weight: 800; }
            .total-row { display: flex; justify-content: space-between; background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .total-label { font-size: 18px; font-weight: 900; }
            .total-value { font-size: 18px; font-weight: 900; color: #D4AF37; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1 class="school-name">CLASS CONNECT</h1>
              <h2 class="title">Payment Receipt</h2>
            </div>
            
            <div class="details">
              <div class="details-row"><span class="label">Receipt No:</span><span class="value">#${item.receiptId}</span></div>
              <div class="details-row"><span class="label">Date:</span><span class="value">${item.payDate || item.dueDate}</span></div>
              <div class="details-row"><span class="label">Student ID:</span><span class="value">${getFormattedStudentId()}</span></div>
              <div class="details-row"><span class="label">Student Name:</span><span class="value">${user?.name || 'Student'}</span></div>
              <div class="details-row"><span class="label">Payment For:</span><span class="value">${item.label}</span></div>
              <div class="details-row"><span class="label">Status:</span><span class="value" style="color: #10b981;">PAID SUCCESSFULLY</span></div>
            </div>

            <div class="total-row">
              <span class="total-label">Amount Paid</span>
              <span class="total-value">₹${item.amount.toLocaleString()}</span>
            </div>

            <div class="footer">
              <p>This is a computer-generated document. No signature is required.</p>
              <p>&copy; 2026 Class Connect. All Rights Reserved.</p>
            </div>
          </div>
          ${action === 'download' ? '<script>window.onload = function() { setTimeout(function(){ window.print(); }, 500); }</script>' : ''}
        </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(receiptHTML);
      newWindow.document.close();
    } else {
      toast.error('Please allow popups to view/download receipts.');
    }
  };

  const paidTimeline = timelineItems.filter((item) => item.status === 'PAID').reverse();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)] px-4 md:px-12 lg:px-16">
      
      {/* Header Panel */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-normal text-[#1B1F3B] tracking-wide" style={{ fontFamily: "'Playball', cursive" }}>
            Fees & Payments
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">
            Track your fee status, payments and download receipts.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-[#E5D3B3]/40 px-4 py-2.5 rounded-2xl shadow-sm text-xs font-bold text-[#1B1F3B] cursor-pointer hover:border-[#D4AF37] transition-all">
          <span>Academic Session 2026-27</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Fees', val: `₹${totalAssessed.toLocaleString()}`, sub: 'Academic Year 2026-27' },
            { label: 'Paid Amount', val: `₹${totalPaid.toLocaleString()}`, sub: '✓ On Track', badge: true },
            { label: 'Outstanding', val: `₹${totalOutstanding.toLocaleString()}`, sub: `${timelineItems.filter(i => i.status !== 'PAID').length} Installments Left` },
            { label: 'Next Due', val: upcomingItem ? `₹${upcomingItem.amount.toLocaleString()}` : 'No Due', sub: upcomingItem ? upcomingItem.dueDate : 'All clear' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-black/5 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-2xl md:text-3xl font-black text-[#1B1F3B] mt-2 font-sans">{kpi.val}</h3>
              <p className={`text-xs mt-1.5 font-bold ${kpi.badge ? 'text-emerald-500' : 'text-gray-400'}`}>
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Main Section: Progress & Checkout/Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Progress Container (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-black/5 p-8 shadow-sm flex flex-col md:flex-row gap-8 justify-between relative overflow-hidden">
            
            {/* Left side info */}
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-xs font-extrabold text-[#1B1F3B]/60 uppercase tracking-widest">Overall Fee Progress</h4>
                <h2 className="text-3xl font-black text-[#1B1F3B] mt-3">
                  ₹{totalPaid.toLocaleString()} Paid of <span className="text-[#D4AF37]">₹{totalAssessed.toLocaleString()}</span>
                </h2>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1B1F3B] to-[#D4AF37] rounded-full transition-all duration-1000"
                  style={{ width: `${paidPercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Remaining Balance</span>
                  <span className="text-lg font-bold text-red-500">₹{totalOutstanding.toLocaleString()}</span>
                </div>
                
                <button className="text-xs font-bold text-[#1B1F3B] hover:text-[#D4AF37] border border-black/10 hover:border-[#D4AF37] py-2 px-4 rounded-xl transition-all flex items-center gap-1">
                  View Fee Breakdown <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Right side circular progress */}
            <div className="flex items-center justify-center shrink-0 w-full md:w-56 h-56 bg-gradient-to-tr from-[#1B1F3B] to-[#252a53] rounded-3xl p-6 text-white relative shadow-inner">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="64" 
                  fill="none" 
                  stroke="#D4AF37" 
                  strokeWidth="12" 
                  strokeDasharray={2 * Math.PI * 64}
                  strokeDashoffset={2 * Math.PI * 64 - (paidPercentage / 100) * (2 * Math.PI * 64)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{paidPercentage}%</span>
                <span className="text-[10px] text-gray-300 font-extrabold uppercase tracking-widest mt-1">Paid</span>
              </div>
            </div>

          </div>

          {/* Upcoming Payment Countdown / Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm h-full flex flex-col justify-between">
              {showCheckout ? (
                // Interactive checkout
                paymentCompleted ? (
                  <div className="py-8 text-center animate-in fade-in zoom-in duration-300 flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="font-extrabold text-lg text-[#1B1F3B] mb-2">Payment Approved!</h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Your transaction has been processed. A receipt has been saved to your payment ledger.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleProcessPayment} className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-base font-bold text-[#1B1F3B] border-b border-black/5 pb-2">Checkout Details</h3>
                    
                    <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 border">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Installment:</span>
                        <span className="font-bold text-black">{payFullYear ? 'Full Year Advance' : upcomingItem?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="font-bold text-[#1B1F3B]">₹{payFullYear ? totalOutstanding.toLocaleString() : upcomingItem?.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {totalOutstanding > (upcomingItem?.amount || 0) && (
                      <label className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#1B1F3B] cursor-pointer bg-amber-50 border border-amber-100 p-2.5 rounded-xl hover:bg-amber-100 transition-colors">
                        <input type="checkbox" checked={payFullYear} onChange={(e) => setPayFullYear(e.target.checked)} className="w-3.5 h-3.5 accent-[#D4AF37]" />
                        Pay remaining full year fees (₹{totalOutstanding.toLocaleString()})
                      </label>
                    )}



                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      {isProcessing ? 'Processing...' : 'Authorize Transaction'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="w-full border border-black/10 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                )
              ) : (
                // Default timer screen
                <>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Upcoming Payment</span>
                      <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100 uppercase tracking-widest">
                        Due Soon
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-400">{upcomingItem ? upcomingItem.label : 'All Cleared!'}</h4>
                    {upcomingItem && (
                      <h2 className="text-3xl font-black text-[#1B1F3B] mt-1.5">
                        ₹{upcomingItem.amount.toLocaleString()}
                      </h2>
                    )}

                    <div className="mt-4 pb-4 border-b border-black/5 flex justify-between text-xs font-semibold text-gray-400">
                      <span>Due Date</span>
                      <span className="text-[#1B1F3B] font-bold">{upcomingItem ? upcomingItem.dueDate : '—'}</span>
                    </div>

                    {upcomingItem && (
                      <div className="grid grid-cols-4 gap-2 text-center mt-6">
                        {[
                          { val: countdown.days, label: 'Days' },
                          { val: countdown.hrs, label: 'Hrs' },
                          { val: countdown.mins, label: 'Mins' },
                          { val: countdown.secs, label: 'Secs' },
                        ].map((time, idx) => (
                          <div key={idx} className="bg-gray-50 border border-black/5 p-2.5 rounded-xl">
                            <span className="text-lg font-black text-[#1B1F3B] block">{String(time.val).padStart(2, '0')}</span>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{time.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={handlePayNow}
                      disabled={!upcomingItem}
                      className="Btn"
                    >
                      Pay Now
                      <svg className="svgIcon" viewBox="0 0 576 512">
                        <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path>
                      </svg>
                    </button>
                    <button className="bg-white border border-black/10 hover:border-[#D4AF37] hover:text-[#D4AF37] p-3.5 rounded-xl text-[#1B1F3B] transition-colors">
                      <Calendar size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Timeline & Financial Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Timeline (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1F3B] mb-6 border-b border-black/5 pb-4">
              Fee Payment Timeline
            </h3>

            <div className="space-y-4">
              {timelineItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-black/5 rounded-2xl bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.status === 'PAID' ? 'bg-emerald-50 text-emerald-500' :
                      item.status === 'UPCOMING' ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-400'
                    }`}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B1F3B] text-sm md:text-base">{item.label}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">₹{item.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase border ${
                        item.status === 'PAID' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        item.status === 'UPCOMING' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-gray-50 border-gray-100 text-gray-500'
                      }`}>
                        {item.status}
                      </span>
                      <p className="text-[9px] text-gray-400 font-bold mt-1 font-mono">{item.dueDate}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleGenerateReceipt(item, 'download')}
                      disabled={item.status !== 'PAID'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
                        item.status === 'PAID' 
                          ? 'bg-[var(--crimson)]/5 border-[var(--crimson)]/10 text-[var(--crimson)] hover:bg-[var(--crimson)] hover:text-white' 
                          : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full text-center py-3 text-xs font-bold text-gray-400 hover:text-[#D4AF37] mt-4 transition-colors">
              View All Installments
            </button>
          </div>

          {/* Side Cards (Right 1 col) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Financial Health */}
            <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
              <h4 className="text-xs font-extrabold text-[#1B1F3B]/60 uppercase tracking-widest mb-4">Financial Health</h4>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <Activity size={24} />
                </div>
                <div>
                  <span className="text-2xl font-black text-[#1B1F3B] block">4.8<span className="text-xs text-gray-400 font-normal">/5</span></span>
                  <span className="text-xs font-bold text-emerald-500">Excellent</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed font-semibold mb-6">
                You have paid all installments on time for the last 3 terms. Keep it up!
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: '🎗 Early Payer', bg: 'bg-amber-50 text-amber-600 border border-amber-100' },
                  { label: '✦ Consistent', bg: 'bg-blue-50 text-blue-600 border border-blue-100' },
                  { label: '✩ No Dues', bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
                ].map((tag, idx) => (
                  <span key={idx} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${tag.bg}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-[32px] border border-black/5 p-6 md:p-8 shadow-sm">
              <h4 className="text-xs font-extrabold text-[#1B1F3B]/60 uppercase tracking-widest mb-2">Payment Methods</h4>
              <p className="text-[10px] text-gray-400 mb-4 font-semibold">UPI, Cards, Netbanking and more</p>
              
              <div className="flex flex-wrap gap-2">
                {['UPI', 'VISA', 'MC', 'NET', '+3'].map((badge, idx) => (
                  <span 
                    key={idx} 
                    className="border border-black/5 bg-gray-50 text-[10px] font-black text-gray-500 px-3.5 py-2 rounded-xl"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* History and Receipts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Payment History (Left 2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[#1B1F3B]">Payment History</h3>
              <button className="text-xs font-bold text-gray-400 hover:text-[#D4AF37] transition-colors">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paidTimeline.map((item, idx) => (
                <div key={idx} className="bg-white border border-black/5 rounded-[20px] p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold font-mono text-gray-400">#{item.receiptId}</span>
                      <h4 className="font-extrabold text-[#1B1F3B] text-sm mt-0.5">{item.label}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Paid via Card</p>
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase border border-emerald-100">
                      PAID
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="text-[10px] text-gray-400 font-mono">{item.payDate}</span>
                    <span className="font-black text-[#1B1F3B] text-base">₹{item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipts (Right 1 col) */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[#1B1F3B]">Receipts</h3>
              <button className="text-xs font-bold text-gray-400 hover:text-[#D4AF37] transition-colors">View All</button>
            </div>

            <div className="space-y-4">
              {paidTimeline.slice(0, 2).map((item, idx) => (
                <div key={idx} className="bg-white border border-black/5 rounded-[20px] p-5 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--crimson)]/5 border border-[var(--crimson)]/10 flex items-center justify-center text-[var(--crimson)] shrink-0">
                      <Download size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B1F3B] text-xs">Receipt #{item.receiptId}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.label}</p>
                      <p className="text-xs font-extrabold text-[#1B1F3B] mt-0.5">₹{item.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button 
                      onClick={() => handleGenerateReceipt(item, 'view')}
                      className="bg-gray-50 border border-black/5 text-[#1B1F3B] hover:bg-gray-100 py-1.5 px-3 rounded-lg text-[10px] font-bold transition-colors">
                      View
                    </button>
                    <button 
                      onClick={() => handleGenerateReceipt(item, 'download')}
                      className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-1.5 px-3 rounded-lg text-[10px] font-bold transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
