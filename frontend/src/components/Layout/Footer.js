import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.gray[50]};
  border-top: 1px solid ${theme.colors.gray[200]};
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.sm};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Football Coach Intelligence. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
