import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import Accounts from './Accounts';
import Transactions from './Transactions';
import Transfer from './Transfer';
import Profile from './Profile';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled(motion.div)`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContainer>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <MainContent>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <ContentArea
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;