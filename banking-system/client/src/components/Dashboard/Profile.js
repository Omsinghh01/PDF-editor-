import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../UI/Loading';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #6b7280;
    font-size: 1rem;
  }
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
  font-weight: 600;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
`;

const ProfileBody = styled.div`
  padding: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
`;

const InfoIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

const InfoDetails = styled.div`
  flex: 1;
`;

const InfoLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-color);
`;

const StatsCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const StatsHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-color);
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SecurityCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const SecurityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SecurityInfo = styled.div`
  h4 {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-color);
    margin: 0 0 0.25rem 0;
  }
  
  p {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  
  &.active {
    background: #d1fae5;
    color: #065f46;
  }
  
  &.secure {
    background: #dbeafe;
    color: #1e40af;
  }
`;

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfileData(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loading text="Loading profile..." />;
  }

  return (
    <ProfileContainer>
      <PageHeader>
        <h1>My Profile</h1>
        <p>Manage your account information and settings</p>
      </PageHeader>

      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProfileHeader>
          <Avatar>
            {getInitials(profileData?.first_name, profileData?.last_name)}
          </Avatar>
          <UserName>
            {profileData?.first_name} {profileData?.last_name}
          </UserName>
          <UserEmail>{profileData?.email}</UserEmail>
        </ProfileHeader>

        <ProfileBody>
          <InfoGrid>
            <InfoItem>
              <InfoIcon>
                <FaUser />
              </InfoIcon>
              <InfoDetails>
                <InfoLabel>Full Name</InfoLabel>
                <InfoValue>
                  {profileData?.first_name} {profileData?.last_name}
                </InfoValue>
              </InfoDetails>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaEnvelope />
              </InfoIcon>
              <InfoDetails>
                <InfoLabel>Email Address</InfoLabel>
                <InfoValue>{profileData?.email}</InfoValue>
              </InfoDetails>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaPhone />
              </InfoIcon>
              <InfoDetails>
                <InfoLabel>Phone Number</InfoLabel>
                <InfoValue>{profileData?.phone || 'Not provided'}</InfoValue>
              </InfoDetails>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaCalendarAlt />
              </InfoIcon>
              <InfoDetails>
                <InfoLabel>Member Since</InfoLabel>
                <InfoValue>
                  {profileData?.created_at ? formatDate(profileData.created_at) : 'N/A'}
                </InfoValue>
              </InfoDetails>
            </InfoItem>
          </InfoGrid>
        </ProfileBody>
      </ProfileCard>

      <StatsCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <StatsHeader>
          <h3>Account Statistics</h3>
        </StatsHeader>
        <StatsGrid>
          <StatItem>
            <StatValue>•••</StatValue>
            <StatLabel>Total Accounts</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>•••</StatValue>
            <StatLabel>Total Transactions</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>•••</StatValue>
            <StatLabel>Total Balance</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>•••</StatValue>
            <StatLabel>This Month</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsCard>

      <SecurityCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <StatsHeader>
          <h3>Security & Privacy</h3>
        </StatsHeader>
        
        <SecurityItem>
          <SecurityInfo>
            <h4>Account Status</h4>
            <p>Your account is active and verified</p>
          </SecurityInfo>
          <StatusBadge className="active">Active</StatusBadge>
        </SecurityItem>

        <SecurityItem>
          <SecurityInfo>
            <h4>Password Security</h4>
            <p>Password was last updated recently</p>
          </SecurityInfo>
          <StatusBadge className="secure">Secure</StatusBadge>
        </SecurityItem>

        <SecurityItem>
          <SecurityInfo>
            <h4>Email Verification</h4>
            <p>Your email address is verified</p>
          </SecurityInfo>
          <StatusBadge className="active">Verified</StatusBadge>
        </SecurityItem>

        <SecurityItem>
          <SecurityInfo>
            <h4>Two-Factor Authentication</h4>
            <p>Enhanced security for your account</p>
          </SecurityInfo>
          <StatusBadge className="secure">Enabled</StatusBadge>
        </SecurityItem>
      </SecurityCard>
    </ProfileContainer>
  );
};

export default Profile;