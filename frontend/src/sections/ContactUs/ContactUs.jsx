import React, { useState } from 'react'
import './ContactUs.css'
import collabBg from '../../assets/CollabBG.png'
import ApplicationForm from '../../components/ApplicationForm'

export default function ContactUs() {
  const [showForm, setShowForm] = useState(false)

  if (showForm) {
    return <ApplicationForm clubName="SYNC AIT Pune" abbr="SYNC" onClose={() => setShowForm(false)} />
  }

  return (
    <section id="contact" className="contact-section" style={{ backgroundImage: `url(${collabBg})` }}>
      <div className="contact-container">
        <div className="contact-content">
          <h1 className="contact-title">Want To Join US</h1>
          <h1 className="contact-subtitle">Just Fill Out The Form</h1>
        </div>
        <div className="contact-button-wrapper">
          <button onClick={() => setShowForm(true)} className="fill-form-btn">
            FILL THE FORM
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
