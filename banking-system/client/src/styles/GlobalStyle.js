import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  :root {
    --primary-color: #2563eb;
    --primary-dark: #1d4ed8;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
    --dark-color: #1f2937;
    --light-color: #f8fafc;
    --border-color: #e5e7eb;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    gap: 0.5rem;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }

  .btn-primary:hover {
    background-color: var(--primary-dark);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background-color: var(--secondary-color);
    color: white;
  }

  .btn-secondary:hover {
    background-color: #059669;
    transform: translateY(-1px);
  }

  .btn-danger {
    background-color: var(--danger-color);
    color: white;
  }

  .btn-danger:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
  }

  .btn-outline {
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
  }

  .btn-outline:hover {
    background-color: var(--primary-color);
    color: white;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    transition: border-color 0.2s ease-in-out;
    background-color: white;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .form-select {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: white;
    cursor: pointer;
  }

  .card {
    background: white;
    border-radius: 1rem;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .card-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background-color: #f8fafc;
  }

  .card-body {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }

  .card-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .alert {
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .alert-success {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .alert-danger {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  .alert-warning {
    background-color: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .mb-0 { margin-bottom: 0; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-5 { margin-bottom: 1.25rem; }
  .mb-6 { margin-bottom: 1.5rem; }

  .mt-0 { margin-top: 0; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-5 { margin-top: 1.25rem; }
  .mt-6 { margin-top: 1.5rem; }

  .grid {
    display: grid;
    gap: 1rem;
  }

  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

  @media (max-width: 768px) {
    .grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;