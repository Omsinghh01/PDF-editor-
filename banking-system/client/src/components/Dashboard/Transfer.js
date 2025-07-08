import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaArrowRight, FaCheck } from 'react-icons/fa';
import { accountAPI, transactionAPI } from '../../services/api';
import { toast } from 'react-toastify';

const TransferContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
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

const TransferForm = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const FormHeader = styled.div`
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

const FormBody = styled.div`
  padding: 2rem;
`;

const FormStep = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StepTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepNumber = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const AccountGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AccountSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TransferIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  
  @media (max-width: 768px) {
    margin: 0 auto;
    transform: rotate(90deg);
  }
`;

const AccountInfo = styled.div`
  background: #f8fafc;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 0.5rem;
`;

const AccountBalance = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  
  strong {
    color: var(--dark-color);
    font-weight: 600;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
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
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: var(--primary-color);
  color: white;
  
  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const SecondaryButton = styled(Button)`
  background: #f3f4f6;
  color: var(--dark-color);
  
  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  padding: 3rem 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: var(--secondary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.5rem;
`;

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedToAccount, setSelectedToAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'fromAccount') {
      const account = accounts.find(acc => acc.account_number === value);
      setSelectedFromAccount(account);
    }
    
    if (name === 'toAccount') {
      const account = accounts.find(acc => acc.account_number === value);
      setSelectedToAccount(account);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.fromAccount === formData.toAccount) {
      toast.error('Cannot transfer to the same account');
      return;
    }
    
    if (parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    
    if (selectedFromAccount && parseFloat(formData.amount) > selectedFromAccount.balance) {
      toast.error('Insufficient funds');
      return;
    }
    
    setLoading(true);
    
    try {
      await transactionAPI.transfer({
        fromAccount: formData.fromAccount,
        toAccount: formData.toAccount,
        amount: parseFloat(formData.amount),
        description: formData.description || 'Transfer'
      });
      
      setTransferComplete(true);
      toast.success('Transfer completed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fromAccount: '',
      toAccount: '',
      amount: '',
      description: ''
    });
    setSelectedFromAccount(null);
    setSelectedToAccount(null);
    setTransferComplete(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (transferComplete) {
    return (
      <TransferContainer>
        <SuccessMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SuccessIcon>
            <FaCheck />
          </SuccessIcon>
          <h2>Transfer Successful!</h2>
          <p>Your transfer of {formatCurrency(formData.amount)} has been completed.</p>
          <ButtonGroup style={{ justifyContent: 'center', marginTop: '2rem' }}>
            <PrimaryButton onClick={resetForm}>
              Make Another Transfer
            </PrimaryButton>
          </ButtonGroup>
        </SuccessMessage>
      </TransferContainer>
    );
  }

  return (
    <TransferContainer>
      <PageHeader>
        <h1>Transfer Money</h1>
        <p>Transfer funds between your accounts instantly and securely</p>
      </PageHeader>

      <TransferForm
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FormHeader>
          <h2>
            <FaExchangeAlt />
            New Transfer
          </h2>
        </FormHeader>

        <FormBody>
          <form onSubmit={handleSubmit}>
            <FormStep>
              <StepTitle>
                <StepNumber>1</StepNumber>
                Select Accounts
              </StepTitle>
              
              <AccountGrid>
                <div>
                  <Label>From Account</Label>
                  <AccountSelect
                    name="fromAccount"
                    value={formData.fromAccount}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select source account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_type} - ••••{account.account_number.slice(-4)}
                      </option>
                    ))}
                  </AccountSelect>
                  {selectedFromAccount && (
                    <AccountInfo>
                      <AccountBalance>
                        Available: <strong>{formatCurrency(selectedFromAccount.balance)}</strong>
                      </AccountBalance>
                    </AccountInfo>
                  )}
                </div>

                <TransferIcon>
                  <FaArrowRight />
                </TransferIcon>

                <div>
                  <Label>To Account</Label>
                  <AccountSelect
                    name="toAccount"
                    value={formData.toAccount}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select destination account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_type} - ••••{account.account_number.slice(-4)}
                      </option>
                    ))}
                  </AccountSelect>
                  {selectedToAccount && (
                    <AccountInfo>
                      <AccountBalance>
                        Current Balance: <strong>{formatCurrency(selectedToAccount.balance)}</strong>
                      </AccountBalance>
                    </AccountInfo>
                  )}
                </div>
              </AccountGrid>
            </FormStep>

            <FormStep>
              <StepTitle>
                <StepNumber>2</StepNumber>
                Transfer Details
              </StepTitle>
              
              <InputGroup>
                <Label>Amount</Label>
                <Input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>Description (Optional)</Label>
                <TextArea
                  name="description"
                  placeholder="Enter a description for this transfer..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </FormStep>

            <ButtonGroup>
              <SecondaryButton type="button" onClick={resetForm}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Processing...' : 'Transfer Money'}
                <FaArrowRight />
              </PrimaryButton>
            </ButtonGroup>
          </form>
        </FormBody>
      </TransferForm>
    </TransferContainer>
  );
};

export default Transfer;