import React from 'react'
import HomeHero from './HomeHero'



import Rooms from './Rooms'
import Facilities from './Facilities'
import Testimonials from './Testimonials'
import ThingsToDo from './ThingsToDo'
import CTA from './CTA'
import Gallery from './Gallery'
import WhyStayWithUs from './WhyStayWithUs'
import AboutUs from './AboutUs'
import FAQ from './FAQ'

const HomePage = () => {
  return (
    <div>
      
        <HomeHero />
        <AboutUs />
        <WhyStayWithUs />
        <Rooms />
        
        <Facilities />
        <Gallery />
        <Testimonials />
        <ThingsToDo />
        <FAQ />
        <CTA />
    </div>
  )
}

export default HomePage