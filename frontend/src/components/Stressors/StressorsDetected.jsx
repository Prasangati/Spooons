import React, {useState} from 'react';
import './StressorsDetected.css';
import api from "../../utils/axiosConfig";

const StressorsDetected = ({ visible, onClose, newstressors,setNewStressors }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    if (!visible) return null;

    const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

    async function onAccept(s) {
    setLoading(true);
    try {
      await api.post(`journal/detected-stressors/${s.id}/accept/`);
      setNewStressors((prev) => prev.filter((item) => item.id !== s.id));
    } catch (error) {
      console.error("Error adding stressor:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onDismiss(s) {
    setLoading(true);
    try {
      await api.post(`journal/detected-stressors/${s.id}/dismiss/`);
      setNewStressors((prev) => prev.filter((item) => item.id !== s.id));
    } catch (error) {
      console.error("Error adding stressor:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }




return (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={handleBackdropClick}
  >
    <div
      className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl relative font-[Poppins]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
        onClick={onClose}
      >
        ✖
      </button>

      {step === 1 ? (
        // Slide 1: Intro
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 font-[Playfair]">
            🧠 Understand Your Stressors
          </h2>
          <p className="text-gray-600 text-base mb-6 max-w-xl mx-auto">
            This feature highlights potential stressors detected by our AI
            from your recent journal entries. Review them to gain a deeper
            understanding of your emotional well-being.
          </p>
          <button
            onClick={() => setStep(2)}
            className="px-6 py-2 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700 transition"
          >
            View Stressors →
          </button>
        </div>
      ) : (
        // Slide 2: Actual stressors
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 font-[Playfair]">
            🧠 Potential Stressors
          </h2>

          {newstressors.length === 0 ? (
            <p className="text-center text-gray-600">
              No new stressors detected from your recent journal entries.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newstressors.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #fff, #f9f9f9)",
                  }}
                >
                  <h4 className="text-xl font-semibold text-blue-800 mb-2">
                    {s.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">{s.description}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => onAccept(s)}
                      className="px-4 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                    >
                      ✅ Keep
                    </button>
                    <button
                      onClick={() => onDismiss(s)}
                      className="px-4 py-1 text-sm rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
                    >
                      ❌ Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default StressorsDetected;
