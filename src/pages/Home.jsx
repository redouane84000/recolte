import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { networks } from "../data/networks";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
};

export default function Home() {
  return (
    <div className="audit">
      <header className="audit-nav audit-nav--simple">
        <Link to="/" className="audit-logo">
          récolte
        </Link>
        <Link className="audit-icon" to="/admin/login" aria-label="Espace client">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
          </svg>
        </Link>
      </header>

      <section className="audit-hero">
        <div className="audit-hero__media" aria-hidden="true">
          <div className="audit-hero__art">
            <div className="audit-orb" />
            <div className="audit-bolt audit-bolt--a" />
            <div className="audit-bolt audit-bolt--b" />
            <svg className="audit-lock" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lockGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="108" r="62" fill="none" stroke="url(#lockGlow)" strokeWidth="1.2" opacity="0.35" />
              <circle cx="100" cy="108" r="48" fill="none" stroke="url(#lockGlow)" strokeWidth="1" opacity="0.5" />
              <path
                d="M72 95h56v48H72z"
                fill="none"
                stroke="url(#lockGlow)"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M82 95V78a18 18 0 0 1 36 0v17"
                fill="none"
                stroke="url(#lockGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="118" r="5" fill="#93c5fd" />
            </svg>
          </div>
          <div className="audit-hero__shade" />
          <div className="audit-hero__glow" />
        </div>

        <div className="audit-hero__inner">
          <motion.p
            className="audit-hero__brand"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            récolte
          </motion.p>

          <motion.h1
            className="audit-hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.75 }}
          >
            Audit de sécurité
            <br />
            informatique
          </motion.h1>

          <motion.p
            className="audit-hero__price"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65 }}
          >
            Premier audit à <strong>1&nbsp;€</strong>
          </motion.p>

          <motion.p
            className="audit-hero__lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
          >
            Analysez la surface d’attaque de vos comptes sociaux et sécurisez
            vos accès. Connectez-vous avec le réseau de votre choix pour
            démarrer votre audit client.
          </motion.p>

          <motion.div
            className="audit-networks"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <p className="audit-networks__label">Se connecter avec</p>
            <div className="audit-networks__grid">
              {networks.map((network) => (
                <motion.div key={network.id} variants={item}>
                  <Link
                    to={`/${network.id}/connexion`}
                    className={`audit-net audit-net--${network.id}`}
                  >
                    <span className="audit-net__spark" aria-hidden="true" />
                    <span className="audit-net__spark audit-net__spark--2" aria-hidden="true" />
                    <span className="audit-net__copy">
                      <span className="audit-net__name">{network.label}</span>
                      <span className="audit-net__cta">Se connecter</span>
                    </span>
                    <span className="audit-net__arrow">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
