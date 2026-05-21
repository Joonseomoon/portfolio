'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { IPortfolioItem } from '../../api';

const WARM_ACCENTS = ['#8C7355', '#7A6E63', '#9E8B78', '#6B7A6B'];

interface ElegantCarouselProps {
    items: IPortfolioItem[];
}

export default function ElegantCarousel({ items }: ElegantCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const SLIDE_DURATION = 6000;
    const TRANSITION_DURATION = 600;

    const goToSlide = useCallback(
        (index: number) => {
            if (isTransitioning || index === currentIndex) return;
            setIsTransitioning(true);
            setProgress(0);
            setTimeout(() => {
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 50);
            }, TRANSITION_DURATION / 2);
        },
        [isTransitioning, currentIndex]
    );

    const goNext = useCallback(() => goToSlide((currentIndex + 1) % items.length), [currentIndex, goToSlide, items.length]);
    const goPrev = useCallback(() => goToSlide((currentIndex - 1 + items.length) % items.length), [currentIndex, goToSlide, items.length]);

    useEffect(() => {
        if (isPaused || items.length <= 1) return;
        progressRef.current = setInterval(() => {
            setProgress((p) => (p >= 100 ? 100 : p + 100 / (SLIDE_DURATION / 50)));
        }, 50);
        intervalRef.current = setInterval(goNext, SLIDE_DURATION);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
        };
    }, [currentIndex, isPaused, goNext, items.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goPrev, goNext]);

    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
    const handleTouchMove  = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
    const handleTouchEnd   = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 60) diff > 0 ? goNext() : goPrev();
    };

    if (items.length === 0) return null;

    const current = items[currentIndex];
    const accent  = WARM_ACCENTS[currentIndex % WARM_ACCENTS.length];
    const vis = isTransitioning ? 'transitioning' : 'visible';

    return (
        <div
            className="carousel-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* ── Image — top, full width, 16:9 ── */}
            <div className="carousel-image-container">
                <div className={`carousel-image-frame ${vis}`}>
                    <img
                        src={current.image_url}
                        alt={current.title}
                        className="carousel-image"
                        draggable={false}
                    />
                    {/* Subtle bottom gradient so image bleeds into the strip */}
                    <div
                        className="carousel-image-overlay"
                        style={{ background: 'linear-gradient(to bottom, transparent 70%, rgba(247,245,240,0.18) 100%)' }}
                    />
                </div>
                <div className="carousel-frame-corner carousel-frame-corner--tl" style={{ borderColor: accent }} />
                <div className="carousel-frame-corner carousel-frame-corner--br" style={{ borderColor: accent }} />
            </div>

            {/* ── Text strip — below image ── */}
            <div className="carousel-inner">
                <div className="carousel-content">
                    <div className="carousel-content-inner">
                        <div className={`carousel-collection-num ${vis}`}>
                            <span className="carousel-num-line" />
                            <span className="carousel-num-text">
                                {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                            </span>
                        </div>

                        <h2 className={`carousel-title ${vis}`}>{current.title}</h2>

                        <p className={`carousel-subtitle ${vis}`} style={{ color: accent }}>
                            Featured Project
                        </p>

                        <p className={`carousel-description ${vis}`}>{current.description}</p>

                        {current.icon_urls.length > 0 && (
                            <div className={`carousel-icons ${vis}`}>
                                {current.icon_urls.map((url, i) => (
                                    <img key={i} src={url} alt="" className="w-4 h-4 object-contain" draggable={false}
                                        style={{ opacity: 0.6 }}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Nav arrows — right column */}
                <div className="carousel-nav-arrows">
                    <button onClick={goPrev} className="carousel-arrow-btn" aria-label="Previous slide">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={goNext} className="carousel-arrow-btn" aria-label="Next slide">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="carousel-progress-bar">
                {items.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`carousel-progress-item ${i === currentIndex ? 'active' : ''}`}
                        aria-label={`Go to slide ${i + 1}`}
                    >
                        <div className="carousel-progress-track">
                            <div
                                className="carousel-progress-fill"
                                style={{
                                    width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%',
                                    backgroundColor: i === currentIndex ? accent : undefined,
                                }}
                            />
                        </div>
                        <span className="carousel-progress-label">{item.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
