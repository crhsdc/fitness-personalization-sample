import React, { useState, useEffect } from 'react';
import './App.css';

// Aggressive ResizeObserver error suppression
if (typeof window !== 'undefined') {
  const suppressResizeObserverError = () => {
    const errorHandler = (e) => {
      if (e.message && e.message.includes('ResizeObserver loop')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return true;
      }
    };
    
    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', errorHandler, true);
    
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver')) return;
      originalConsoleError.apply(console, args);
    };
    
    window.onerror = (msg) => {
      if (msg && msg.includes('ResizeObserver')) return true;
      return false;
    };
  };
  
  suppressResizeObserverError();
}

function App() {
  useEffect(() => {
    // Additional runtime suppression
    const handleError = (e) => {
      if (e.message && e.message.includes('ResizeObserver')) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    country: '',
    sport: ''
  });
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const prompt = `Generate a prompt for creating a fitness image with a person who practices ${formData.sport} has ${formData.age} years and is on ${formData.country}. DO NOT GENERATE MORE THAN 1024 CHARACTERS.`;
    
    try {
      const response = await fetch(process.env.REACT_APP_TEXT_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      const result = await response.json();
      const textResult = result.generated_text;
      setGeneratedText(textResult);
      
      // Second API call with generated text (truncated to 1024 chars for Nova Canvas)
      const maxLength = parseInt(process.env.REACT_APP_MAX_PROMPT_LENGTH) || 1024;
      const truncatedPrompt = textResult.length > maxLength ? textResult.substring(0, maxLength) : textResult;
      const imageResponse = await fetch(process.env.REACT_APP_IMAGE_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: truncatedPrompt })
      });
      
      const imageResult = await imageResponse.json();
      
      if (imageResponse.ok && imageResult.b64_image) {
        setGeneratedImage(imageResult.b64_image);
        setIsSubmitted(true);
      } else {
        throw new Error(imageResult.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending request. Check console for details.');
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading">
            <h2>Generating your fitness image...</h2>
            <div className="spinner"></div>
          </div>
        </div>
      ) : !isSubmitted ? (
        <div className="form-container">
          <h1>Fitness Profile</h1>
          <form onSubmit={handleSubmit} className="fitness-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sport</label>
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              required
            >
              <option value="">Select a sport</option>
              <option value="yoga">Yoga</option>
              <option value="martial-arts">Martial Arts</option>
              <option value="football">Football</option>
              <option value="gym">Gym</option>
              <option value="calisthenics">Calisthenics</option>
            </select>
          </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="results-wrapper">
          <div className="results-container">
            <div className="text-result">
              <h2>Generated Text:</h2>
              <p>{generatedText}</p>
            </div>
            
            <div className="image-result">
              <h2>Generated Image:</h2>
              {generatedImage ? (
                <img src={`data:image/png;base64,${generatedImage}`} alt="Generated" className="result-image" />
              ) : (
                <p>Image failed to load</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;