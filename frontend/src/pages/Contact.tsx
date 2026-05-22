import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { MailIcon, MapPinIcon, LinkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ContactCard } from '../components/ui/contact-card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

// ── Timing ────────────────────────────────────────────────────────────────────
const STRONG_EASE_OUT = [0.23, 1, 0.32, 1] as const;
const ITEM_DURATION_S = 0.45;

// ── Warm monochrome tokens ────────────────────────────────────────────────────
const COLOR = {
    bg:      '#F7F5F0',
    text:    '#1C1917',
    muted:   '#78716C',
    label:   '#A8A29E',
    border:  'rgba(28,25,23,0.1)',
};

// ── Form field wrapper ────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label>{label}</Label>
            {children}
        </div>
    );
}

// ── Contact info data ─────────────────────────────────────────────────────────
const CONTACT_INFO = [
    { icon: MailIcon,     label: 'Email',    value: 'jsmoon416@gmail.com' },
    { icon: MapPinIcon,   label: 'Location', value: 'Boston, MA · Honolulu, HI' },
    { icon: LinkIcon,     label: 'GitHub',   value: 'github.com/joonseomoon' },
    { icon: LinkIcon,     label: 'LinkedIn', value: 'linkedin.com/in/joonseomoon' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Contact() {
    const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus]   = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        const { error } = await supabase.functions.invoke('send-contact-email', { body: form });
        if (error) {
            setStatus('error');
            setErrorMsg(error.message ?? 'Something went wrong. Please try again.');
        } else {
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        }
    };

    return (
        <MotionConfig reducedMotion="user">
            <div
                className="flex-1 overflow-y-auto relative"
                style={{ background: COLOR.bg, fontFamily: '"DM Sans", system-ui, sans-serif' }}
            >
                {/* Grain overlay */}
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat', backgroundSize: '160px',
                        opacity: 0.025, mixBlendMode: 'multiply',
                    }}
                />

                <div
                    className="relative z-10 flex items-center"
                    style={{ minHeight: '100%', padding: 'max(5vh, 32px) max(5vw, 32px)' }}
                >

                    {/* ── Contact card ─────────────────────────────── */}
                    <motion.div
                        style={{ width: '100%', maxWidth: 1100, margin: '0 auto' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: ITEM_DURATION_S, ease: STRONG_EASE_OUT, delay: 0.1 } }}
                    >
                        <ContactCard
                            title="Get in touch"
                            description="Have a question, a project idea, or just want to say hello? Fill out the form and I'll get back to you."
                            contactInfo={CONTACT_INFO}
                        >
                            {/* ── Success state ── */}
                            {status === 'success' ? (
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '32px 0', textAlign: 'center' }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        background: 'rgba(28,25,23,0.06)',
                                        border: `1px solid ${COLOR.border}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8l3.5 3.5L13 4.5" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <p style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', fontStyle: 'italic', color: COLOR.text }}>
                                        Message sent.
                                    </p>
                                    <p style={{ fontSize: 12, color: COLOR.label, maxWidth: '22ch', lineHeight: 1.6 }}>
                                        Thanks for reaching out — I'll be in touch soon.
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="contact-reset-btn"
                                        style={{
                                            marginTop: 8, fontSize: 11, letterSpacing: '0.08em',
                                            color: COLOR.label, background: 'none', border: 'none',
                                            cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
                                        }}
                                    >
                                        Send another →
                                    </button>
                                </div>
                            ) : (
                                /* ── Form ── */
                                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <Field label="Name">
                                            <Input
                                                type="text" name="name"
                                                value={form.name} onChange={handleChange}
                                                placeholder="Joonseo Moon" required
                                            />
                                        </Field>
                                        <Field label="Email">
                                            <Input
                                                type="email" name="email"
                                                value={form.email} onChange={handleChange}
                                                placeholder="you@example.com" required
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Subject">
                                        <Input
                                            type="text" name="subject"
                                            value={form.subject} onChange={handleChange}
                                            placeholder="What's this about?" required
                                        />
                                    </Field>

                                    <Field label="Message">
                                        <Textarea
                                            name="message"
                                            value={form.message} onChange={handleChange}
                                            placeholder="Your message..." required rows={5}
                                        />
                                    </Field>

                                    {status === 'error' && (
                                        <p style={{ fontSize: 12, color: '#b45309' }}>{errorMsg}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="contact-submit-btn"
                                        style={{
                                            width: '100%', padding: '10px 0',
                                            background: COLOR.text, color: COLOR.bg,
                                            border: 'none', borderRadius: 10,
                                            fontSize: 12, letterSpacing: '0.1em',
                                            fontFamily: '"DM Sans", system-ui, sans-serif',
                                            fontWeight: 500, textTransform: 'uppercase',
                                            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                            opacity: status === 'loading' ? 0.6 : 1,
                                        }}
                                    >
                                        {status === 'loading' ? 'Sending…' : 'Send message'}
                                    </button>
                                </form>
                            )}
                        </ContactCard>
                    </motion.div>
                </div>
            </div>
        </MotionConfig>
    );
}
