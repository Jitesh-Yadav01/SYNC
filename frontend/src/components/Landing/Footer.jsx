import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
    { title: "GitHub", href: "https://github.com/JiteshYadavvvvv/NEXUS" },
    { title: "LinkedIn", href: "https://in.linkedin.com/company/gdsc-aitpune" },
    { title: "Instagram", href: "https://www.instagram.com/gdsc_aitpune/" },
];

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Events", to: "/events" },
    { label: "Clubs", to: "/clubs" },
    { label: "Developers", to: "/developers" },
];

export default function Footer() {
    const footerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = footerRef.current.querySelectorAll("[data-scroll-animation]");
            elements.forEach(u => {
                gsap.set(u, { opacity: 0, y: 30 });
                gsap.to(u, {
                    opacity: 1,
                    y: 0,
                    delay: parseFloat(u.dataset.scrollAnimation) || 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: u,
                        start: "top 90%",
                        toggleActions: "play pause resume reverse"
                    }
                });
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} id="footer" className="c-footer_section">
            <div className="c-footer_container">
                <div className="c-footer_top-wrapper" data-scroll-animation="0">
                    <div className="c-footer_main-grid">
                        <div className="c-footer_col c-footer_col--main">
                            <Link to="/" className="c-footer_brand-link" aria-label="NEXUS Home" onClick={() => window.scrollTo(0,0)}>
                                <img src="/nexus.svg" alt="NEXUS" className="c-footer_logo-small" />
                            </Link>
                            <p className="c-footer_identity-text">
                                The central project that syncs all the clubs of Army Institute of Technology, Pune.
                            </p>
                            <div className="c-footer_gdg-lockup">
                                <span className="c-footer_made-by">Built by</span>
                                <img src="/clublogos/google-developers.svg" alt="GDG On Campus AIT" className="c-footer_gdg-logo" />
                            </div>
                        </div>

                        <div className="c-footer_col c-footer_col--nav">
                            <span className="c-footer_eyebrow">Platform</span>
                            <ul className="c-footer_nav-list">
                                {NAV_LINKS.map(link => (
                                    <li key={link.label}>
                                        <Link to={link.to} className="c-footer_nav-link" onClick={() => window.scrollTo(0,0)}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="c-footer_col c-footer_col--social">
                            <span className="c-footer_eyebrow">Connect</span>
                            <ul className="c-footer_nav-list">
                                {SOCIAL_LINKS.map(social => (
                                    <li key={social.title}>
                                        <a href={social.href} target="_blank" rel="noopener noreferrer" className="c-footer_nav-link c-footer_nav-link--external">
                                            {social.title} <span className="c-footer_arrow">↗</span>
                                        </a>
                                    </li>
                                ))}
                                <li className="c-footer_cta-wrapper">
                                    <Link to="/get-started" className="c-footer_btn-primary" onClick={() => window.scrollTo(0,0)}>
                                        Join NEXUS
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                <div className="c-footer_huge-branding" data-scroll-animation="0.1" aria-hidden="true">
                    NEXUS
                </div>

                <div className="c-footer_baseline" data-scroll-animation="0.2">
                    <p className="c-footer_baseline-text">© {new Date().getFullYear()} NEXUS · Army Institute of Technology, Pune</p>
                </div>
            </div>
        </footer>
    );
}
