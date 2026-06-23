import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { UploadCloud, Image as ImageIcon, Loader2, RefreshCw, Leaf, Sparkles, ScanLine, Code, Mail } from 'lucide-react'

function App() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setResult(null)
      setError(null)
    } else {
      setError("Please select a valid image file.")
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    processFile(droppedFile)
  }, [])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    processFile(selectedFile)
  }

  const handlePredict = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setResult(response.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || "Failed to connect to the prediction server.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="app-wrapper">
      {/* Animated Background Elements */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon-wrapper">
              <Leaf size={24} className="logo-icon" />
            </div>
            <span className="logo-text">GreenClassify</span>
          </div>
          <div className="nav-links">
            <a href="#about" className="nav-link">Platform</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <a 
              href="#prediction" 
              className="nav-btn"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to top/prediction section first
                document.getElementById('prediction').scrollIntoView({ behavior: 'smooth' });
                // Add highlight effect instead of opening file dialog
                if (!previewUrl) {
                  setTimeout(() => {
                    setIsHighlighted(true);
                    setTimeout(() => setIsHighlighted(false), 1500); // Remove after 1.5 seconds
                  }, 400);
                }
              }}
            >
              Try Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="prediction" className="hero-section">
        <div className="hero-content">
          <h1 className="main-heading">
            Identify Vegetables with <br/>
            <span className="gradient-text">Artificial Intelligence</span>
          </h1>
          <p className="sub-heading">
            Experience lightning-fast, highly accurate vegetable recognition. Simply upload an image and let our AI do the rest.
          </p>

          <div className="main-card-wrapper">
            <div className={`glass-card ${isLoading ? 'is-loading' : ''}`}>
              {!previewUrl ? (
                <div 
                  className={`upload-zone ${isDragging ? 'drag-active' : ''} ${isHighlighted ? 'highlight-active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <div className="upload-glow"></div>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                  <div className="upload-icon-container">
                    <UploadCloud size={40} className="upload-icon mx-auto" />
                  </div>
                  <h3 className="upload-text">Upload your image</h3>
                  <p className="upload-subtext">Drag & drop or click to browse</p>
                  <div className="upload-formats">Supports JPG, PNG, WEBP</div>
                </div>
              ) : (
                <div className="preview-container">
                  <div className="image-wrapper">
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                    {isLoading && <div className="scanning-overlay"><ScanLine size={48} className="scan-icon" /></div>}
                  </div>
                  
                  {!result && !isLoading && (
                    <button className="primary-btn pulse-anim" onClick={handlePredict}>
                      <ImageIcon size={20} />
                      Analyze Vegetable
                    </button>
                  )}

                  {isLoading && (
                    <button className="primary-btn loading-btn" disabled>
                      <Loader2 size={20} className="spinner" />
                      Analyzing Image...
                    </button>
                  )}

                  {error && (
                    <div className="error-message">
                      <div className="error-icon">!</div>
                      {error}
                    </div>
                  )}

                  {result && (
                    <div className="result-reveal">
                      <div className="result-card">
                        <div className="result-header">Detection Complete</div>
                        <div className="result-content">
                          <div className="result-label">{result.label}</div>
                          <div className="confidence-wrapper">
                            <div className="confidence-text">
                              <span>Accuracy</span>
                              <span className="confidence-val">{result.confidence}%</span>
                            </div>
                            <div className="confidence-bar-bg">
                              <div 
                                className="confidence-bar-fill" 
                                style={{ width: `${result.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="secondary-btn" onClick={handleReset}>
                        <RefreshCw size={18} />
                        Analyze Another Image
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="info-section dark-bg">
        <div className="section-container">
          <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
          <div className="title-underline"></div>
          <div className="feature-list" style={{ marginTop: '3rem' }}>
            <div className="feature-item" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div className="feature-icon">1</div>
              <span>Upload an image of any vegetable.</span>
            </div>
            <div className="feature-item" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div className="feature-icon">2</div>
              <span>Our AI model analyzes the image features.</span>
            </div>
            <div className="feature-item" style={{ justifyContent: 'center' }}>
              <div className="feature-icon">3</div>
              <span>Get instant results with high accuracy!</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="info-section">
        <div className="info-grid">
          <div className="info-text-col">
            <h2 className="section-title">The Future of <span className="gradient-text">Food Recognition</span></h2>
            <p className="section-text">
              GreenClassify uses state-of-the-art convolutional neural networks trained on thousands of images to instantly recognize diverse types of vegetables. Whether you're building a smart kitchen app or automating grocery checkout, our API delivers unmatched accuracy.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon"><Sparkles size={20}/></div>
                <span>99.8% Classification Accuracy</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Leaf size={20}/></div>
                <span>Supports 50+ Vegetable Varieties</span>
              </div>
            </div>
          </div>
          <div className="info-visual-col">
            <div className="abstract-visual">
              <div className="glass-panel panel-1">
                <span className="panel-emoji">🥦</span>
              </div>
              <div className="glass-panel panel-2">
                <span className="panel-emoji">🍅</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-icon-wrapper" style={{ width: '32px', height: '32px' }}>
                <Leaf size={18} className="logo-icon" />
              </div>
              <span className="logo-text" style={{ fontSize: '1.25rem' }}>GreenClassify</span>
            </div>
            <div className="footer-links">
              <a href="https://github.com/PratikPatil156/greenclassify" target="_blank" rel="noopener noreferrer" className="footer-link">
                <Code size={18} />
                <span>GitHub</span>
              </a>
              <a href="#" className="footer-link">
                <Mail size={18} />
                <span>Contact Us</span>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 <span>GreenClassify</span>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
