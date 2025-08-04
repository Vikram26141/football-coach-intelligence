import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => props.spacing || theme.spacing.lg};
`;

const LogoIcon = styled.div`
  width: ${props => props.size === 'large' ? '120px' : props.size === 'medium' ? '80px' : '60px'};
  height: ${props => props.size === 'large' ? '120px' : props.size === 'medium' ? '80px' : '60px'};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const LogoText = styled.div`
  font-size: ${props => props.size === 'large' ? '3rem' : props.size === 'medium' ? '2rem' : '1.5rem'};
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AppName = styled.h1`
  font-size: ${props => props.size === 'large' ? theme.typography.fontSize['3xl'] : 
                     props.size === 'medium' ? theme.typography.fontSize['2xl'] : 
                     theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin: 0;
  text-align: center;
  line-height: 1.2;
`;

const Logo = ({ size = 'medium', showText = true, spacing }) => {
  return (
    <LogoContainer spacing={spacing}>
      <LogoIcon size={size}>
        <LogoText size={size}>⚽</LogoText>
      </LogoIcon>
      {showText && (
        <AppName size={size}>Football Coach Intelligence</AppName>
      )}
    </LogoContainer>
  );
};

export default Logo;
