import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useAuth } from '../../services/AuthContext';
import Button from '../UI/Button';
import Logo from '../UI/Logo';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.gray[50]};
`;

const FormContainer = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing['2xl']};
  border: 1px solid ${theme.colors.gray[300]};
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  font-size: ${theme.typography.fontSize.base};
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const ErrorText = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.xs};
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const StyledLink = styled(Link)`
  color: ${theme.colors.accent};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    
    return hasUpperCase && hasNumber && hasSpecialChar;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must contain 1 uppercase letter, 1 number, and 1 special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/coach');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      setErrors({ general: error.message || 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Logo size="large" spacing={theme.spacing['2xl']} />
        <Title>Sign Up</Title>
        
        <Form onSubmit={handleSubmit}>
          <div>
            <Input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </div>

          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </div>

          <div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </div>

          <div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </div>

          {errors.general && (
            <ErrorText>{errors.general}</ErrorText>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Sign Up
          </Button>
        </Form>

        <LinkText>
          Already have an account? <StyledLink to="/signin">Sign in</StyledLink>
        </LinkText>
      </FormContainer>
    </PageContainer>
  );
};

export default SignUpForm;
