import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface FormState {
    name: string;
    email: string;
    subject: string;
    message: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

// ---------------------------------------------------------------------------
// Input / Textarea base styles
// ---------------------------------------------------------------------------
const fieldBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(200,216,255,0.04)',
    border: '1px solid rgba(200,216,255,0.12)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e8eeff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#6b7fa3' }}>
                {label}
            </label>
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Contact() {
    const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = 'rgba(200,216,255,0.35)';
        e.currentTarget.style.background = 'rgba(200,216,255,0.07)';
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = 'rgba(200,216,255,0.12)';
        e.currentTarget.style.background = 'rgba(200,216,255,0.04)';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        const { error } = await supabase.functions.invoke('send-contact-email', {
            body: form,
        });

        if (error) {
            setStatus('error');
            setErrorMsg(error.message ?? 'Something went wrong. Please try again.');
        } else {
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        }
    };

    return (
        <div className="flex-1 overflow-y-auto" style={{ background: '#03030f' }}>

            {/* Deep-space gradient */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, #0b0b2e 0%, #03030f 65%)',
                    zIndex: 0,
                }}
            />

            <div className="relative z-10 mx-auto max-w-xl px-6 py-16">

                {/* Header */}
                <div className="mb-12 text-center">
                    <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-3" style={{ color: '#6b7fa3' }}>
                        Get in touch
                    </p>
                    <h1
                        className="text-4xl sm:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #e8eeff 0%, #c8d8ff 45%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 18px rgba(165,180,252,0.3))',
                        }}
                    >
                        Contact
                    </h1>
                    <div
                        className="mx-auto mt-5 h-px w-16"
                        style={{ background: 'linear-gradient(to right, transparent, rgba(200,216,255,0.4), transparent)' }}
                    />
                    <p className="mt-5 text-sm leading-relaxed" style={{ color: '#6b7fa3' }}>
                        Have a question or want to work together? Send me a message and I'll get back to you.
                    </p>
                </div>

                {/* Success state */}
                {status === 'success' ? (
                    <div
                        className="rounded-2xl p-8 text-center"
                        style={{
                            background: 'rgba(200,216,255,0.05)',
                            border: '1px solid rgba(200,216,255,0.15)',
                        }}
                    >
                        <div
                            className="mx-auto mb-4 flex items-center justify-center rounded-full"
                            style={{ width: '48px', height: '48px', background: 'rgba(200,216,255,0.1)', border: '1px solid rgba(200,216,255,0.2)' }}
                        >
                            <span style={{ color: '#c8d8ff', fontSize: '20px' }}>✓</span>
                        </div>
                        <h2 className="text-lg font-semibold mb-2" style={{ color: '#e8eeff' }}>Message sent</h2>
                        <p className="text-sm" style={{ color: '#6b7fa3' }}>Thanks for reaching out — I'll be in touch soon.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-6 text-sm cursor-pointer transition-colors duration-200"
                            style={{ color: '#6b7fa3' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c8d8ff'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6b7fa3'; }}
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Name + Email row */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Name">
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    placeholder="Joonseo Moon"
                                    required
                                    style={fieldBase}
                                />
                            </Field>
                            <Field label="Email">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    placeholder="you@example.com"
                                    required
                                    style={fieldBase}
                                />
                            </Field>
                        </div>

                        <Field label="Subject">
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="What's this about?"
                                required
                                style={fieldBase}
                            />
                        </Field>

                        <Field label="Message">
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="Your message..."
                                required
                                rows={6}
                                style={{ ...fieldBase, resize: 'vertical' }}
                            />
                        </Field>

                        {/* Error */}
                        {status === 'error' && (
                            <p className="text-sm" style={{ color: '#f87171' }}>
                                {errorMsg}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: '#c8d8ff',
                                color: '#03030f',
                                boxShadow: '0 0 24px rgba(200,216,255,0.2)',
                            }}
                            onMouseEnter={(e) => {
                                if (status !== 'loading') {
                                    (e.currentTarget as HTMLButtonElement).style.background = '#e8eeff';
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(200,216,255,0.35)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = '#c8d8ff';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(200,216,255,0.2)';
                            }}
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
