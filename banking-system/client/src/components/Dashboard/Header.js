import React from 'react';
import styled from 'styled-components';
import { FaBars, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--dark-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-color);
`;

const UserEmail = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #fee2e2;
  }
`;

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>
          <FaBars />
        </MenuButton>
        <Title>Banking Dashboard</Title>
      </LeftSection>
      
      <RightSection>
        <UserInfo>
          <UserAvatar>
            {getInitials(user?.firstName, user?.lastName) || <FaUser />}
          </UserAvatar>
          <UserDetails>
            <UserName>{user?.firstName} {user?.lastName}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserDetails>
        </UserInfo>
        
        <LogoutButton onClick={logout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </LogoutButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;