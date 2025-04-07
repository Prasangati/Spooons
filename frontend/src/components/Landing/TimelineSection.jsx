import { motion } from 'framer-motion';
import './TimelineSection.css';

const timelineEvents = [
  { date: 'Jan 2025', description: 'Project idea and Tech Stack Discussion' },
  { date: 'Feb 2025', description: 'Set up repo and dev tools' },
  { date: 'Mar 2025', description: 'Completed User Authentication and Start Landing Page' },
  { date: 'Apr 2025', description: 'Goals: Finish Landing page for unauthenticated user and set up openAI API' },
  { date: 'May 2025', description: 'Yet to be determined' },
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
