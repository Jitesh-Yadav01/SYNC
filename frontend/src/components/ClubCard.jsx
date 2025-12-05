import React, { useState } from 'react'
import '../sections/Clubs/club.css'
import KnowMore from './KnowMore'

export default function ClubCard({ abbr, name, img, desc, focusAreas = [], activities = [], who, keywords = [], events = [], onApply }) {
  const [showKnow, setShowKnow] = useState(false)
  const knowMore = () => setShowKnow(true)

  return (
    <article className="club" aria-labelledby={`${abbr}-title`}>
      <div className="top">
        <img src={img} alt={`${name} logo`} className="club-logo" />
        <h3 id={`${abbr}-title`} className="section-title title-violet">{name}</h3>
      </div>

      <p className="lead">{desc}</p>

      {keywords && keywords.length > 0 && (
        <ul className="keywords-list" aria-label={`${abbr} keywords`}>
          {keywords.map((k, idx) => (
            <li key={k + idx}>{k}</li>
          ))}
        </ul>
      )}

      <div className="info-grid">
        {focusAreas && focusAreas.length > 0 && (
          <div className="info-item">
            <div className="info-title">Focus</div>
            <div className="info-body">
              <ul className="main-activities">
                {focusAreas.map((f, i) => (<li key={abbr + '-focus-' + i}>{f}</li>))}
              </ul>
            </div>
          </div>
        )}

        {activities && activities.length > 0 && (
          <div className="info-item">
            <div className="info-title">Main activity</div>
            <div className="info-body">
              <ul className="main-activities">
                {activities.map((a, i) => (<li key={abbr + '-act-' + i}>{a}</li>))}
              </ul>
            </div>
          </div>
        )}

        {who && (
          <div className="info-item">
            <div className="info-title">Who</div>
            <div className="info-body">{who}</div>
          </div>
        )}
      </div>
      {events && events.length > 0 && (
        <div className="events-section" aria-label={`${abbr} activities`}>
          <strong>Activities</strong>
          <ul className="events-list">
            {events.map((e, i) => (<li key={abbr + '-evt-' + i}>{e}</li>))}
          </ul>
        </div>
      )}

      <button className="apply-btn" onClick={() => onApply(abbr, name)}>
        Click Here to Apply
      </button>
      <button className='know-btn' onClick={()=>knowMore()}>Know More</button>
      <KnowMore open={showKnow} onClose={()=>setShowKnow(false)} club={{abbr,name,img,desc,focusAreas,activities,who,keywords,events}} />
    </article>
  )
}

