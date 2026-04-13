import React from 'react'
import DashboardCardsSection from '../components/DashboardCardsSection'

const AdminDashboardPage = () => {
  return (
    <section aria-label='dashboard-page' className=" bg-gray-100 p-4 rounded-md min-h-screen">
      <DashboardCardsSection />
    </section>
  )
}

export default AdminDashboardPage