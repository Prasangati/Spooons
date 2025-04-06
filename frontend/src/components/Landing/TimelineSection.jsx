import { motion } from 'framer-motion';
import './TimelineSection.css';

const timelineEvents = [
  { date: 'Jan 2024', description: 'Project idea and initial planning' },
  { date: 'Feb 2024', description: 'Set up repo and dev tools' },
  { date: 'Mar 2024', description: 'Hero & Feature sections complete' },
  { date: 'Apr 2024', description: 'Developer section added' },
  { date: 'May 2024', description: 'Timeline section launched 🎉' },
];

export default function TimelineSection() {
  return (
      <section className="timeline-section">
          <motion.h2
              className="timeline-title"
              initial={{opacity: 0, y: 40}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
          >
              Project Timeline
          </motion.h2>

          {/* ✅ Scrollable wrapper */}
          <div className="timeline-scroll-wrapper">
              <div className="timeline-horizontal">
                  <div className="timeline-line-horizontal"/>
                  {timelineEvents.map((event, index) => (
                      <motion.div
                          key={index}
                          className="timeline-item-horizontal"
                          initial={{opacity: 0, y: 40}}
                          whileInView={{opacity: 1, y: 0}}
                          transition={{duration: 0.6, delay: index * 0.2}}
                      >
                          <span className="circle-horizontal"/>
                          <div className="timeline-card-horizontal">
                              <h3>{event.date}</h3>
                              <p>{event.description}</p>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>
  );
}
