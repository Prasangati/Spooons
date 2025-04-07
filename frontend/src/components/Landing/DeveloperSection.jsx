import { motion } from 'framer-motion';
import './DeveloperSection.css';

const developers = [
  { name: 'Prasanga Tiwari', img: '/dev1.png' },
  { name: 'Malak S.', img: '/dev2.png' },
  { name: 'Raitah J.', img: '/dev3.png' },
  { name: 'Ryan M.', img: '/dev4.png' },
];

export default function DeveloperSection() {
  return (
    <section className="developer-section">
      <motion.h2
        className="dev-title"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Meet the Developers
      </motion.h2>

      <div className="dev-cards">
        {developers.map((dev, index) => (
          <motion.div
            key={index}
            className="dev-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <img src={dev.img} alt={dev.name} />
            <p>{dev.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

