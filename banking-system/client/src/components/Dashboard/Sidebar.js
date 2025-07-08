import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaCreditCard, 
  FaExchangeAlt, 
  FaHistory, 
  FaUser, 
  FaTimes,
  FaUniversity
} from 'react-icons/fa';

const SidebarOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: white;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow-y: auto;
  
  @media (min-width: 769px) {
    position: relative;
    box-shadow: none;
    border-right: 1px solid var(--border-color);
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
  position: relative;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    background: var(--primary-color);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
  }
  
  .text {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--dark-color);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  padding: 1rem 0;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border-right: 3px solid transparent;
  
  .icon {
    font-size: 1rem;
  }
  
  &:hover {
    background-color: #f8fafc;
    color: var(--primary-color);
  }
  
  &.active {
    background-color: #eff6ff;
    color: var(--primary-color);
    border-right-color: var(--primary-color);
  }
`;

const menuItems = [
  { path: '/dashboard', icon: FaHome, label: 'Overview', exact: true },
  { path: '/dashboard/accounts', icon: FaCreditCard, label: 'Accounts' },
  { path: '/dashboard/transfer', icon: FaExchangeAlt, label: 'Transfer Money' },
  { path: '/dashboard/transactions', icon: FaHistory, label: 'Transactions' },
  { path: '/dashboard/profile', icon: FaUser, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -280 }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <SidebarOverlay
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <SidebarContainer
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SidebarHeader>
          <Logo>
            <div className="icon">
              <FaUniversity />
            </div>
            <div className="text">Banking Pro</div>
          </Logo>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </SidebarHeader>

        <Navigation>
          <NavList>
            {menuItems.map((item) => (
              <NavItem key={item.path}>
                <NavLinkStyled
                  to={item.path}
                  className={({ isActive }) => {
                    if (item.exact) {
                      return location.pathname === item.path ? 'active' : '';
                    }
                    return isActive ? 'active' : '';
                  }}
                  onClick={onClose}
                >
                  <item.icon className="icon" />
                  <span>{item.label}</span>
                </NavLinkStyled>
              </NavItem>
            ))}
          </NavList>
        </Navigation>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;