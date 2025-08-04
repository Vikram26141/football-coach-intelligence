import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.gray[200]};
  height: calc(100vh - 64px);
  padding: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const NavItem = styled(Link)`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  color: ${props => props.$active ? theme.colors.primary : theme.colors.gray[600]};
  background-color: ${props => props.$active ? theme.colors.primary + '10' : 'transparent'};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  
  &:hover {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.primary};
  }
`;

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <SidebarContainer>
      <SidebarNav>
        <NavItem to="/coach" $active={isActive('/coach')}>
          📊 Dashboard
        </NavItem>
        <NavItem to="/analytics" $active={isActive('/analytics')}>
          📈 Analytics
        </NavItem>
        <NavItem to="/heatmap" $active={isActive('/heatmap')}>
          🗺️ Heatmap
        </NavItem>
        <NavItem to="/profile" $active={isActive('/profile')}>
          👤 Profile
        </NavItem>
        <NavItem to="/settings" $active={isActive('/settings')}>
          ⚙️ Settings
        </NavItem>
      </SidebarNav>
    </SidebarContainer>
  );
};

export default Sidebar;
