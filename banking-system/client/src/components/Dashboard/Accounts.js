import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlus, FaCreditCard, FaEye, FaEyeSlash } from 'react-icons/fa';
import { accountAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../UI/Loading';

const AccountsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dark-color);
    margin: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const CreateAccountCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CardBody = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FormGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AccountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const AccountCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
  border: 1px solid var(--border-color);
`;

const AccountCardHeader = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 1.5rem;
  position: relative;
`;

const AccountType = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-transform: capitalize;
`;

const AccountNumber = styled.p`
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
`;

const AccountCardBody = styled.div`
  padding: 1.5rem;
`;

const BalanceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BalanceLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const BalanceAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const AccountStatus = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: var(--secondary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 3rem 2rem;
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

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAccountType, setNewAccountType] = useState('');
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if (!newAccountType) {
      toast.error('Please select an account type');
      return;
    }
    
    setCreating(true);
    
    try {
      await accountAPI.createAccount(newAccountType);
      toast.success('Account created successfully!');
      setNewAccountType('');
      fetchAccounts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create account');
    } finally {
      setCreating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatAccountNumber = (accountNumber) => {
    return `•••• •••• •••• ${accountNumber.slice(-4)}`;
  };

  if (loading) {
    return <Loading text="Loading accounts..." />;
  }

  return (
    <AccountsContainer>
      <PageHeader>
        <h1>My Accounts</h1>
      </PageHeader>

      <CreateAccountCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CardHeader>
          <h2>
            <FaPlus />
            Create New Account
          </h2>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleCreateAccount}>
            <FormGroup>
              <Label>Account Type</Label>
              <Select
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value)}
                required
              >
                <option value="">Select account type</option>
                <option value="checking">Checking Account</option>
                <option value="savings">Savings Account</option>
                <option value="credit">Credit Account</option>
              </Select>
            </FormGroup>
            <Button
              type="submit"
              disabled={creating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {creating ? 'Creating...' : 'Create Account'}
              <FaPlus />
            </Button>
          </Form>
        </CardBody>
      </CreateAccountCard>

      {accounts.length > 0 ? (
        <AccountsGrid>
          {accounts.map((account, index) => (
            <AccountCard
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AccountCardHeader>
                <AccountType>{account.account_type} Account</AccountType>
                <AccountNumber>{formatAccountNumber(account.account_number)}</AccountNumber>
              </AccountCardHeader>
              
              <AccountCardBody>
                <BalanceSection>
                  <BalanceLabel>Available Balance</BalanceLabel>
                  <ToggleButton onClick={() => setBalanceVisible(!balanceVisible)}>
                    {balanceVisible ? <FaEyeSlash /> : <FaEye />}
                  </ToggleButton>
                </BalanceSection>
                
                <BalanceAmount>
                  {balanceVisible ? formatCurrency(account.balance) : '••••••'}
                </BalanceAmount>
                
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AccountStatus>{account.status}</AccountStatus>
                  <FaCreditCard style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }} />
                </div>
              </AccountCardBody>
            </AccountCard>
          ))}
        </AccountsGrid>
      ) : (
        <EmptyState>
          <FaCreditCard className="icon" />
          <h3>No accounts found</h3>
          <p>Create your first account to get started with banking</p>
        </EmptyState>
      )}
    </AccountsContainer>
  );
};

export default Accounts;