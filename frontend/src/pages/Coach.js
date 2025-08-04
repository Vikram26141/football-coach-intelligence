import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from '../components/UI/Button';

const DashboardContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing['2xl']};
`;

const StatCard = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[200]};
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.sm};
`;

const ActionSection = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[200]};
  padding: ${theme.spacing.lg};
`;

const Coach = () => {
  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      
      <StatsGrid>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Total Matches</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Fast Breaks Detected</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Hours Analyzed</StatLabel>
        </StatCard>
      </StatsGrid>

      <ActionSection>
        <h2>Quick Actions</h2>
        <p>Upload a match video to get started with AI-powered football analysis.</p>
        <Button variant="primary" size="lg">
          Upload Video
        </Button>
      </ActionSection>
    </DashboardContainer>
  );
};

export default Coach;
