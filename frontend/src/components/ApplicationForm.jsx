import React, { useState } from 'react'
import '../pages/Home/Clubs/form.css'

export default function ApplicationForm({ clubName, abbr, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    branch: '',
    division: '',
    positionYear: '',
    registrationNumber: '',
    phoneNumber: '',
    priority: '',
    motivation: '',
    domain: '',
    projectLink: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert(`Application submitted for ${clubName}!`)
      onClose()
    }, 1800)
  }

  return (
    <div className="application-page">
      <div className="application-container">
        <button className="back-btn" onClick={onClose} aria-label="Go back">
          ← Back to Clubs
        </button>

        <h2 className="form-title">FILL YOUR DATA</h2>

        {loading ? (
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <img src="./loader.gif" alt="Loading..." style={{ width: '64px', height: '64px' }} />
          </div>
        ) : (
          <form className="application-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>College Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your college email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Branch <span className="required">*</span></label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Your Branch</option>
                  <option value="COMP">Computer Engineering</option>
                  <option value="IT">Information Technology</option>
                  <option value="EnTC">Electronics and Telecommunication Engineering</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="ARE">Automatiive and Robotics Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label>Division <span className="required">*</span></label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Your Division</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Position/Year <span className="required">*</span></label>
                <select
                  name="positionYear"
                  value={formData.positionYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Your Position/Year</option>
                  <option value="FE">FE</option>
                  <option value="SE">SE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Registration Number <span className="required">*</span></label>
                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="Enter registration number"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority (1-15) <span className="required">*</span></label>
                <input
                  type="number"
                  name="priority"
                  placeholder={`Rate ${clubName} priority (1-15)`}
                  min="1"
                  max="15"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Why do you want to join {abbr}? <span className="required">*</span></label>
              <textarea
                name="motivation"
                placeholder={`Tell us your motivation to join ${clubName}...`}
                value={formData.motivation}
                onChange={handleChange}
                maxLength="500"
                rows="5"
                required
              ></textarea>
              <div className="char-count">{formData.motivation.length}/500</div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Your Domain <span className="required">*</span></label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Your Domain</option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="fullstack">Full Stack Development</option>
                  <option value="app">App Dev</option>
                  <option value="ml">AI/ML</option>
                  <option value="cloud">Cloud / DevOps</option>
                  <option value="design">UI/UX Design</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="flutter">Flutter</option>
                  <option value="outreach">Outreach</option>
                </select>
              </div>

              <div className="form-group">
                <label>Best Project (GitHub Link) Not Compulsory</label>
                <input
                  type="url"
                  name="projectLink"
                  placeholder="https://github.com/username/project"
                  value={formData.projectLink}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">Submit Form</button>

            <p className="form-footer">
              By submitting this form, you agree to join our amazing community of developers!
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
