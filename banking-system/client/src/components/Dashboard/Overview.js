import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaCreditCard, 
  FaPlus, 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { accountAPI, transactionAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../UI/Loading';

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AccountsSection = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
`;

const AccountsList = styled.div`
  padding: 0;
`;

const AccountItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AccountIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AccountName = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: var(--dark-color);
  text-transform: capitalize;
`;

const AccountNumber = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const AccountBalance = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BalanceAmount = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  text-decoration: none;
  color: var(--dark-color);
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
  
  .icon {
    font-size: 1.25rem;
    color: var(--primary-color);
  }
`;

const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--dark-color);
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const Overview = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accountsResponse = await accountAPI.getAccounts();
      const accountsData = accountsResponse.data;
      setAccounts(accountsData);
      
      // Calculate total balance
      const total = accountsData.reduce((sum, account) => sum + account.balance, 0);
      setTotalBalance(total);
      
      // Fetch recent transactions for the first account (if exists)
      if (accountsData.length > 0) {
        const transactionsResponse = await transactionAPI.getHistory(accountsData[0].account_number, { limit: 5 });
        setRecentTransactions(transactionsResponse.data);
      }
    } catch (error) {
      toast.error('Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatAccountNumber = (accountNumber) => {
    return `•••• ${accountNumber.slice(-4)}`;
  };

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <OverviewContainer>
      <WelcomeSection>
        <h1>Welcome back!</h1>
        <p>Here's an overview of your banking activity</p>
      </WelcomeSection>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatHeader>
            <StatTitle>Total Balance</StatTitle>
            <ToggleButton onClick={() => setBalanceVisible(!balanceVisible)}>
              {balanceVisible ? <FaEyeSlash /> : <FaEye />}
            </ToggleButton>
          </StatHeader>
          <StatValue>
            {balanceVisible ? formatCurrency(totalBalance) : '••••••'}
          </StatValue>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatTitle>Active Accounts</StatTitle>
          </StatHeader>
          <StatValue>{accounts.length}</StatValue>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>Recent Transactions</StatTitle>
          </StatHeader>
          <StatValue>{recentTransactions.length}</StatValue>
        </StatCard>
      </StatsGrid>

      <AccountsSection>
        <SectionHeader>
          <SectionTitle>Your Accounts</SectionTitle>
          <Link to="/dashboard/accounts" className="btn btn-outline">
            <FaPlus /> Add Account
          </Link>
        </SectionHeader>
        
        <AccountsList>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountItem key={account.id}>
                <AccountInfo>
                  <AccountIcon>
                    <FaCreditCard />
                  </AccountIcon>
                  <AccountDetails>
                    <AccountName>{account.account_type} Account</AccountName>
                    <AccountNumber>{formatAccountNumber(account.account_number)}</AccountNumber>
                  </AccountDetails>
                </AccountInfo>
                <AccountBalance>
                  <BalanceAmount>
                    {balanceVisible ? formatCurrency(account.balance) : '••••••'}
                  </BalanceAmount>
                </AccountBalance>
              </AccountItem>
            ))
          ) : (
            <EmptyState>
              <FaCreditCard className="icon" />
              <h3>No accounts found</h3>
              <p>Create your first account to get started with banking</p>
              <Link to="/dashboard/accounts" className="btn btn-primary">
                <FaPlus /> Create Account
              </Link>
            </EmptyState>
          )}
        </AccountsList>
      </AccountsSection>

      <div>
        <SectionTitle style={{ marginBottom: '1rem' }}>Quick Actions</SectionTitle>
        <QuickActions>
          <ActionButton to="/dashboard/transfer">
            <FaExchangeAlt className="icon" />
            Transfer Money
          </ActionButton>
          <ActionButton to="/dashboard/transactions">
            <FaArrowUp className="icon" />
            Deposit Funds
          </ActionButton>
          <ActionButton to="/dashboard/transactions">
            <FaArrowDown className="icon" />
            Withdraw Funds
          </ActionButton>
        </QuickActions>
      </div>
    </OverviewContainer>
  );
};

export default Overview;