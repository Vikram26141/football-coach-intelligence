import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useAuth } from '../../services/AuthContext';
import Button from '../UI/Button';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  z-index: ${theme.zIndex.header};
`;

const Logo = styled(Link)`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const NavLink = styled(Link)`
  color: ${theme.colors.gray[600]};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        ⚽ Football Coach Intelligence
      </Logo>
      
      <Nav>
        {user ? (
          <>
            <NavLink to="/coach">Dashboard</NavLink>
            <NavLink to="/analytics">Analytics</NavLink>
            <NavLink to="/heatmap">Heatmap</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </>
        )}
      </Nav>

      <UserSection>
        {user ? (
          <>
            <span>Welcome, {user.display_name || user.username}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </>
        )}
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
