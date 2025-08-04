import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const InputContainer = styled.div`
  position: relative;
  margin-bottom: ${theme.spacing.md};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  transition: border-color ${theme.transitions.fast};
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px ${theme.colors.accent}20;
  }
  
  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
  
  ${props => props.$error && `
    border-color: ${theme.colors.error};
    
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px ${theme.colors.error}20;
    }
  `}
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[700]};
  font-size: ${theme.typography.fontSize.sm};
`;

const ErrorText = styled.span`
  display: block;
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
`;

const ToggleButton = styled.button`
  position: absolute;
  right: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.gray[500]};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  
  &:hover {
    color: ${theme.colors.gray[700]};
  }
`;

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  icon,
  showPasswordToggle = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  };

  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <div style={{ position: 'relative' }}>
        <StyledInput
          type={type === 'password' && showPasswordToggle ? inputType : type}
          $error={error}
          {...props}
        />
        {type === 'password' && showPasswordToggle && (
          <ToggleButton type="button" onClick={handleTogglePassword}>
            {showPassword ? '👁️' : '🙈'}
          </ToggleButton>
        )}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

export default Input;
