import React from 'react';
import { cn } from '../../lib/utils';
import { type LucideIcon, PlusIcon } from 'lucide-react';

// ── Warm monochrome tokens ────────────────────────────────────────────────────
const COLOR = {
    text:   '#1C1917',
    muted:  '#78716C',
    label:  '#A8A29E',
    border: 'rgba(28,25,23,0.1)',
    panelBg:'rgba(28,25,23,0.025)',
    iconBg: 'rgba(28,25,23,0.05)',
    corner: 'rgba(28,25,23,0.18)',
};

type ContactInfoItem = React.ComponentProps<'div'> & {
    icon: LucideIcon;
    label: string;
    value: string;
};

type ContactCardProps = React.ComponentProps<'div'> & {
    title?: string;
    description?: string;
    contactInfo?: ContactInfoItem[];
    formSectionClassName?: string;
};

function ContactInfoRow({ icon: Icon, label, value, className, ...props }: ContactInfoItem) {
    return (
        <div className={cn('flex items-center gap-3 py-2.5', className)} {...props}>
            <div style={{
                background: COLOR.iconBg,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 10,
                padding: 10,
                flexShrink: 0,
            }}>
                <Icon style={{ width: 15, height: 15, color: COLOR.muted }} />
            </div>
            <div>
                <p style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: 12, fontWeight: 500,
                    color: COLOR.text, marginBottom: 1,
                }}>
                    {label}
                </p>
                <p style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: 11, color: COLOR.label,
                }}>
                    {value}
                </p>
            </div>
        </div>
    );
}

export function ContactCard({
    title = 'Get in touch',
    description,
    contactInfo,
    className,
    formSectionClassName,
    children,
    ...props
}: ContactCardProps) {
    return (
        <div
            className={cn('relative grid w-full md:grid-cols-2 lg:grid-cols-3', className)}
            style={{
                border: `1px solid ${COLOR.border}`,
                boxShadow: '0 8px 40px rgba(28,25,23,0.07), 0 2px 8px rgba(28,25,23,0.04)',
            }}
            {...props}
        >
            {/* Corner markers */}
            {(['top-left','top-right','bottom-left','bottom-right'] as const).map((pos) => (
                <PlusIcon
                    key={pos}
                    style={{
                        position: 'absolute', width: 20, height: 20,
                        color: COLOR.corner,
                        top:    pos.includes('top')    ? -10 : undefined,
                        bottom: pos.includes('bottom') ? -10 : undefined,
                        left:   pos.includes('left')   ? -10 : undefined,
                        right:  pos.includes('right')  ? -10 : undefined,
                    }}
                />
            ))}

            {/* Left info panel */}
            <div className="flex flex-col lg:col-span-2" style={{ background: '#F7F5F0' }}>
                <div className="relative h-full space-y-5 px-6 py-8 md:p-10">
                    <h2 style={{
                        fontFamily: '"DM Serif Display", Georgia, serif',
                        fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                        fontWeight: 400, fontStyle: 'italic',
                        lineHeight: 1.1, letterSpacing: '-0.02em',
                        color: COLOR.text,
                    }}>
                        {title}.
                    </h2>
                    {description && (
                        <p style={{
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                            fontSize: '0.875rem', lineHeight: 1.75,
                            color: COLOR.muted, maxWidth: '48ch',
                        }}>
                            {description}
                        </p>
                    )}
                    {contactInfo && contactInfo.length > 0 && (
                        <div style={{
                            display: 'grid', gap: 4,
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            marginTop: 8,
                        }}>
                            {contactInfo.map((info, i) => (
                                <ContactInfoRow key={i} {...info} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right form panel */}
            <div
                className={cn('flex h-full w-full items-start md:col-span-1 md:[border-top:none] md:[border-left:1px_solid_rgba(28,25,23,0.1)]', formSectionClassName)}
                style={{
                    background: COLOR.panelBg,
                    borderTop: `1px solid ${COLOR.border}`,
                    padding: 24,
                }}
            >
                {children}
            </div>
        </div>
    );
}
