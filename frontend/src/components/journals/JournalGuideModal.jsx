import React, { useState } from "react";

const JournalGuideModal = () => {
  const [isOpen, setIsOpen] = useState(false);


  return (
      <>
          <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1 bg-white text-indigo-700 border border-indigo-300 rounded-md shadow hover:bg-indigo-50 transition text-sm"
              title="How to write your journal entry"
          >
              Tips
          </button>

          {isOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
                  onClick={() => setIsOpen(false)}
              >
                  <div
                      className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh] relative"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <button
                          onClick={() => setIsOpen(false)}
                          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                      >
                          ✖
                      </button>
                      <h2 className="text-2xl font-bold text-center mb-4 font-[Playfair]">
                          📝 How to Write Your Journal Entry
                      </h2>
                      <p className="text-gray-700 mb-4">
                          We encourage you to write freely — let your thoughts flow. But a little structure can help you
                          reflect more deeply and make the most of this experience.
                      </p>

                      <h3 className="text-lg font-semibold text-indigo-700 mt-4 mb-1">🔍 Stressors</h3>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                          <li>Was something stressful or triggering today?</li>
                          <li>Is it new or ongoing?</li>
                          <li>How is it affecting your mood or focus?</li>
                          <li>You don’t have to say “A stressor is...” — just describe it naturally.</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-indigo-700 mt-4 mb-1">💡 Possible Solutions</h3>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                          <li>Do you already know how to address it?</li>
                          <li>Are you feeling overwhelmed or unsure?</li>
                          <li>Would you like help generating ideas?</li>
                      </ul>

                      <h3 className="text-lg font-semibold text-indigo-700 mt-4 mb-1">✅ Accomplishments</h3>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                          <li>Did you make progress on something today?</li>
                          <li>Even small wins count.</li>
                          <li>If not, reflect on what got in the way and what could be different tomorrow.</li>
                      </ul>

                      <p className="text-gray-600 italic mt-4">
                          Use this guide only if you need it — your voice and story matter most.
                      </p>
                  </div>
              </div>
          )}
      </>
  );
};

export default JournalGuideModal;
