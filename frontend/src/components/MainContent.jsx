import React, { useState } from 'react'
import ClubCard from './ClubCard'
import ApplicationForm from './ApplicationForm'

const clubs = [
  {
    abbr:'OSS',
    name:'OSS Club (Open Source Software Club)',
    desc:'Encouraging students to contribute to open source projects and learn collaborative software development.',
    focusAreas:['Open source contribution workflows','Version control & collaboration (Git/GitHub)','Documentation, testing and CI'],
    activities:['INNERVE','FSOC','Graphica ', 'Spark','Internal SIH ', 'Replica'],
    who:'FE,SE',
    
  },
  {
    abbr:'GDG',
    name:'GDG AIT Pune (Google Developer Group)',
    desc:'Community-driven developer group focused on practical developer skills and technology learning.',
    focusAreas:['Web & mobile development','Cloud and architecture','Developer tooling and best practices'],
    activities:['Frontend Jams','Backend Jams','FSOC', 'Enliven','FSOC','Google Cloud Workshop','Android Development Session','Tech Talks','Developer Meetups'],
    who:'FE,SE',
   
  },
  {
    abbr:'CP',
    name:'CP Club (Competitive Programming Club)',
    desc:'Focused training and practice for programming contests and technical interviews.',
    focusAreas:['Data structures & algorithms','Problem-solving strategies','Contest practice and timing'],
    activities:['CODEFT 4.0','CRACK 5.1','CRACK 5.2','KICKSTARTER'],
    who:'FE,SE',
  
  }
]

export default function MainContent(){
  const [selectedClub, setSelectedClub] = useState(null)
  
  const handleApply = (abbr, name) => {
    setSelectedClub({ abbr, name })
  }
  
  if (selectedClub) {
    return (
      <ApplicationForm
        clubName={selectedClub.name}
        abbr={selectedClub.abbr}
        onClose={() => setSelectedClub(null)}
      />
    )
  }
  
  return (
    <main className="main">
      <div className="page-head">
        <div>
          <h1 className="section-title title-dark"> SYNC </h1><br/>
          <h1 className="section-title title-dark"> AIT Pune</h1>
          <p>Explore student-run clubs that help you build, learn and grow.</p>
        </div>
      </div>

      <section className="cards" aria-label="Clubs list">
        {clubs.map(c => (
          <ClubCard key={c.abbr} {...c} onApply={handleApply} />
        ))}
      </section>

      
    </main>
  )
}
