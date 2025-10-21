import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="main-layout">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`main-content-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header isCollapsed={isCollapsed} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
