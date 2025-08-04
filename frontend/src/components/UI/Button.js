import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  border: none;
  outline: none;
  text-decoration: none;
  font-family: inherit;
  
  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Size variants */
  ${props => props.size === 'sm' && css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    min-height: 36px;
  `}

  ${props => props.size === 'md' && css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.base};
    min-height: 44px;
  `}

  ${props => props.size === 'lg' && css`
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    font-size: ${theme.typography.fontSize.lg};
    min-height: 52px;
  `}

  /* Variant styles */
  ${props => props.variant === 'primary' && css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    box-shadow: ${theme.shadows.sm};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray[700]};
    }
  `}

  ${props => props.variant === 'secondary' && css`
    background-color: ${theme.colors.white};
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.gray[300]};
    box-shadow: ${theme.shadows.sm};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray[50]};
      border-color: ${theme.colors.gray[400]};
    }
  `}

  ${props => props.variant === 'accent' && css`
    background-color: ${theme.colors.accent};
    color: ${theme.colors.white};
    box-shadow: ${theme.shadows.sm};

    &:hover:not(:disabled) {
      background-color: #059669;
    }
  `}

  ${props => props.variant === 'ghost' && css`
    background-color: transparent;
    color: ${theme.colors.gray[600]};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[800]};
    }
  `}

  ${props => props.variant === 'danger' && css`
    background-color: ${theme.colors.error};
    color: ${theme.colors.white};
    box-shadow: ${theme.shadows.sm};

    &:hover:not(:disabled) {
      background-color: #dc2626;
    }
  `}

  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}

  /* Loading state */
  ${props => props.loading && css`
    pointer-events: none;
    opacity: 0.7;
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  return (
    <ButtonBase
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </ButtonBase>
  );
};

export default Button;
