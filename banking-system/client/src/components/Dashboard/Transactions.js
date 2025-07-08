import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt, 
  FaPlus,
  FaMinus,
  FaFilter,
  FaCalendarAlt
} from 'react-icons/fa';
import { accountAPI, transactionAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../UI/Loading';

const TransactionsContainer = styled.div`
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

const ActionCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const ActionCardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--dark-color);
    margin: 0 0 0.25rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
`;

const ActionCardBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div``;

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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DepositButton = styled(Button)`
  background: var(--secondary-color);
  color: white;
  
  &:hover:not(:disabled) {
    background: #059669;
  }
`;

const WithdrawButton = styled(Button)`
  background: var(--danger-color);
  color: white;
  
  &:hover:not(:disabled) {
    background: #dc2626;
  }
`;

const TransactionHistory = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const HistoryHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-color);
    margin: 0;
  }
`;

const FilterSection = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: #f8fafc;
  display: flex;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TransactionsList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const TransactionItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  
  &.deposit {
    background: var(--secondary-color);
  }
  
  &.withdrawal {
    background: var(--danger-color);
  }
  
  &.transfer {
    background: var(--primary-color);
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TransactionType = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-color);
  text-transform: capitalize;
`;

const TransactionDescription = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const TransactionDate = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const TransactionAmount = styled.div`
  text-align: right;
`;

const Amount = styled.span`
  font-size: 1rem;
  font-weight: 600;
  
  &.positive {
    color: var(--secondary-color);
  }
  
  &.negative {
    color: var(--danger-color);
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
`;

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [depositForm, setDepositForm] = useState({ account: '', amount: '', description: '' });
  const [withdrawForm, setWithdrawForm] = useState({ account: '', amount: '', description: '' });
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAccounts();
      const accountsData = response.data;
      setAccounts(accountsData);
      
      if (accountsData.length > 0 && !selectedAccount) {
        setSelectedAccount(accountsData[0].account_number);
      }
    } catch (error) {
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (accountNumber) => {
    try {
      const response = await transactionAPI.getHistory(accountNumber);
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!depositForm.account || !depositForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (parseFloat(depositForm.amount) <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    
    setDepositLoading(true);
    
    try {
      await transactionAPI.deposit({
        accountNumber: depositForm.account,
        amount: parseFloat(depositForm.amount),
        description: depositForm.description || 'Deposit'
      });
      
      toast.success('Deposit completed successfully!');
      setDepositForm({ account: '', amount: '', description: '' });
      fetchAccounts();
      if (selectedAccount) {
        fetchTransactions(selectedAccount);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Deposit failed');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!withdrawForm.account || !withdrawForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (parseFloat(withdrawForm.amount) <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    
    setWithdrawLoading(true);
    
    try {
      await transactionAPI.withdraw({
        accountNumber: withdrawForm.account,
        amount: parseFloat(withdrawForm.amount),
        description: withdrawForm.description || 'Withdrawal'
      });
      
      toast.success('Withdrawal completed successfully!');
      setWithdrawForm({ account: '', amount: '', description: '' });
      fetchAccounts();
      if (selectedAccount) {
        fetchTransactions(selectedAccount);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Withdrawal failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaArrowUp />;
      case 'withdrawal':
        return <FaArrowDown />;
      case 'transfer':
        return <FaExchangeAlt />;
      default:
        return <FaExchangeAlt />;
    }
  };

  const getAmountDisplay = (transaction) => {
    const isPositive = transaction.transaction_type === 'deposit' || 
                      (transaction.transaction_type === 'transfer' && transaction.to_account === selectedAccount);
    
    return {
      amount: formatCurrency(transaction.amount),
      className: isPositive ? 'positive' : 'negative',
      prefix: isPositive ? '+' : '-'
    };
  };

  if (loading) {
    return <Loading text="Loading transactions..." />;
  }

  return (
    <TransactionsContainer>
      <PageHeader>
        <h1>Transactions</h1>
        <p>Manage your deposits, withdrawals, and view transaction history</p>
      </PageHeader>

      <ActionCards>
        <ActionCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActionCardHeader>
            <h3>
              <FaPlus />
              Deposit Money
            </h3>
            <p>Add funds to your account</p>
          </ActionCardHeader>
          <ActionCardBody>
            <Form onSubmit={handleDeposit}>
              <FormGroup>
                <Label>Account</Label>
                <Select
                  value={depositForm.account}
                  onChange={(e) => setDepositForm({...depositForm, account: e.target.value})}
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.account_number}>
                      {account.account_type} - ••••{account.account_number.slice(-4)}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description (Optional)</Label>
                <Input
                  type="text"
                  placeholder="Enter description..."
                  value={depositForm.description}
                  onChange={(e) => setDepositForm({...depositForm, description: e.target.value})}
                />
              </FormGroup>
              
              <DepositButton
                type="submit"
                disabled={depositLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {depositLoading ? 'Processing...' : 'Deposit'}
                <FaArrowUp />
              </DepositButton>
            </Form>
          </ActionCardBody>
        </ActionCard>

        <ActionCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ActionCardHeader>
            <h3>
              <FaMinus />
              Withdraw Money
            </h3>
            <p>Withdraw funds from your account</p>
          </ActionCardHeader>
          <ActionCardBody>
            <Form onSubmit={handleWithdraw}>
              <FormGroup>
                <Label>Account</Label>
                <Select
                  value={withdrawForm.account}
                  onChange={(e) => setWithdrawForm({...withdrawForm, account: e.target.value})}
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.account_number}>
                      {account.account_type} - ••••{account.account_number.slice(-4)}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description (Optional)</Label>
                <Input
                  type="text"
                  placeholder="Enter description..."
                  value={withdrawForm.description}
                  onChange={(e) => setWithdrawForm({...withdrawForm, description: e.target.value})}
                />
              </FormGroup>
              
              <WithdrawButton
                type="submit"
                disabled={withdrawLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {withdrawLoading ? 'Processing...' : 'Withdraw'}
                <FaArrowDown />
              </WithdrawButton>
            </Form>
          </ActionCardBody>
        </ActionCard>
      </ActionCards>

      <TransactionHistory>
        <HistoryHeader>
          <h2>Transaction History</h2>
        </HistoryHeader>
        
        <FilterSection>
          <FormGroup style={{ flex: 1 }}>
            <Label>Account</Label>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">All accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.account_number}>
                  {account.account_type} - ••••{account.account_number.slice(-4)}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FilterSection>

        <TransactionsList>
          {transactions.length > 0 ? (
            transactions.map((transaction) => {
              const amountDisplay = getAmountDisplay(transaction);
              return (
                <TransactionItem key={transaction.id}>
                  <TransactionInfo>
                    <TransactionIcon className={transaction.transaction_type}>
                      {getTransactionIcon(transaction.transaction_type)}
                    </TransactionIcon>
                    <TransactionDetails>
                      <TransactionType>{transaction.transaction_type}</TransactionType>
                      <TransactionDescription>{transaction.description}</TransactionDescription>
                      <TransactionDate>{formatDate(transaction.created_at)}</TransactionDate>
                    </TransactionDetails>
                  </TransactionInfo>
                  <TransactionAmount>
                    <Amount className={amountDisplay.className}>
                      {amountDisplay.prefix}{amountDisplay.amount}
                    </Amount>
                  </TransactionAmount>
                </TransactionItem>
              );
            })
          ) : (
            <EmptyState>
              <FaExchangeAlt className="icon" />
              <h3>No transactions found</h3>
              <p>Your transaction history will appear here</p>
            </EmptyState>
          )}
        </TransactionsList>
      </TransactionHistory>
    </TransactionsContainer>
  );
};

export default Transactions;