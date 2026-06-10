import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

interface FeeItem {
  id: string;
  service: string;
  subjectCode: string;
  subjectName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  transactionId?: string;
  paymentDate?: string;
}

const defaultFeeItems: FeeItem[] = [
  {
    id: 'FEE-29011',
    service: 'Compartment Exam',
    subjectCode: 'MAT-101',
    subjectName: 'Mathematics (Class 10)',
    amount: 500,
    dueDate: 'Jun 25, 2026',
    status: 'Unpaid',
  },
  {
    id: 'FEE-29002',
    service: 'Re-evaluation Request',
    subjectCode: 'SCI-102',
    subjectName: 'Science (Class 10)',
    amount: 250,
    dueDate: 'May 10, 2026',
    status: 'Paid',
    transactionId: 'TXN-902188201',
    paymentDate: 'May 08, 2026'
  }
];

export default function AdditionalExamFee() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [activePaymentItem, setActivePaymentItem] = useState<FeeItem | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('school_additional_exam_fees');
    if (stored) {
      try {
        setFeeItems(JSON.parse(stored));
      } catch (err) {
        setFeeItems(defaultFeeItems);
      }
    } else {
      setFeeItems(defaultFeeItems);
      localStorage.setItem('school_additional_exam_fees', JSON.stringify(defaultFeeItems));
    }

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  const handlePayClick = (item: FeeItem) => {
    setActivePaymentItem(item);
    setPaymentSuccess(false);
    setCardName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentItem) return;

    setIsProcessing(true);

    // Simulate network delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      const txnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const payDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

      const updated = feeItems.map(item => {
        if (item.id === activePaymentItem.id) {
          return {
            ...item,
            status: 'Paid' as const,
            transactionId: txnId,
            paymentDate: payDate
          };
        }
        return item;
      });

      setFeeItems(updated);
      localStorage.setItem('school_additional_exam_fees', JSON.stringify(updated));
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--cream)]">
      {/* Header */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--dark)] rounded-2xl flex items-center justify-center shrink-0">
            <CreditCard size={32} className="text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Compartment & Re-evaluation Fee Portal
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Process outstanding fees for re-evaluations, compartment exams, and answer sheet viewings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Fees List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 border-b border-black/5 pb-4">
              Compartment & Re-evaluation Invoices
            </h3>

            <div className="space-y-4">
              {feeItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-2xl p-5 md:p-6 transition-all duration-300 ${
                    item.status === 'Unpaid' 
                      ? 'border-red-100 bg-red-50/20' 
                      : 'border-black/5 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">{item.id}</span>
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-xs font-bold text-[#1B1F3B] bg-gray-100 px-2 py-0.5 rounded">
                        {item.service}
                      </span>
                    </div>
                    <div>
                      {item.status === 'Paid' ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle size={12} /> Pending Payment
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)] text-base">{item.subjectName}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Course Code: <span className="font-mono font-semibold">{item.subjectCode}</span></p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-black flex items-center justify-end">
                        <span className="text-sm font-normal text-gray-400 mr-0.5">₹</span>
                        {item.amount}.00
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {item.status === 'Paid' ? `Paid on ${item.paymentDate}` : `Due: ${item.dueDate}`}
                      </p>
                    </div>
                  </div>

                  {item.status === 'Paid' && item.transactionId && (
                    <div className="mt-4 pt-3 border-t border-black/5 flex flex-wrap justify-between text-[10px] text-gray-400 font-mono">
                      <span>TXN ID: {item.transactionId}</span>
                      <span>Gateway: Stripe Corporate</span>
                    </div>
                  )}

                  {item.status === 'Unpaid' && (
                    <div className="mt-5 pt-4 border-t border-black/5 flex justify-end">
                      <button
                        onClick={() => handlePayClick(item)}
                        className="bg-[#1B1F3B] hover:bg-[#D4AF37] text-white py-2 px-5 rounded-xl text-xs font-bold shadow transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard size={14} /> Pay Invoice Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Modal Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm sticky top-24">
            {!activePaymentItem ? (
              <div className="text-center py-16">
                <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
                <h4 className="font-bold text-[var(--text-primary)] text-sm mb-1">Secure Checkout</h4>
                <p className="text-xs text-[var(--text-muted)] px-4">
                  Select an unpaid compartment or re-evaluation invoice and click 'Pay Invoice Now' to load payment options.
                </p>
              </div>
            ) : paymentSuccess ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 mx-auto text-emerald-500">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="font-bold text-lg text-[var(--text-primary)] mb-2">Payment Approved!</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                  Invoice <span className="font-bold text-black">{activePaymentItem.id}</span> has been paid in full. A receipt has been sent to your registered student email.
                </p>
                <button
                  onClick={() => setActivePaymentItem(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-6 rounded-xl text-xs font-bold transition-colors w-full"
                >
                  Done & Dismiss
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                  Secure Checkout
                </h3>
                <p className="text-xs text-[var(--text-muted)] border-b border-black/5 pb-4 mb-4">
                  Gateway secured with AES 256-bit encryption.
                </p>

                <div className="border border-black/5 bg-gray-50 rounded-xl p-4 mb-5 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Bill Item:</span>
                    <span className="font-bold text-black text-right max-w-[150px] truncate">{activePaymentItem.service}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Invoice Ref:</span>
                    <span className="font-mono text-black">{activePaymentItem.id}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-black/5 pt-2.5">
                    <span className="font-bold text-black">Grand Total:</span>
                    <span className="font-black text-[#1B1F3B]">₹{activePaymentItem.amount}.00</span>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full border border-black/10 rounded-xl px-4.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      placeholder="•••• •••• •••• ••••"
                      className="w-full border border-black/10 rounded-xl px-4.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            setExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                          } else {
                            setExpiry(val);
                          }
                        }}
                        className="w-full border border-black/10 rounded-xl px-4.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full border border-black/10 rounded-xl px-4.5 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-gray-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                    <span>3D Secure verification active.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#1B1F3B] hover:bg-[#D4AF37] text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-colors shadow-md mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Processing Transaction...
                      </>
                    ) : (
                      `Authorize Payment of ₹${activePaymentItem.amount}.00`
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
