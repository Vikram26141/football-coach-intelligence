import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const AnalyticsContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const PlaceholderCard = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[200]};
  padding: ${theme.spacing['2xl']};
  text-align: center;
  color: ${theme.colors.gray[500]};
`;

const Analytics = () => {
  return (
    <AnalyticsContainer>
      <Title>Analytics</Title>
      <PlaceholderCard>
        <h3>Analytics Dashboard</h3>
        <p>Upload and analyze match videos to see detailed analytics here.</p>
      </PlaceholderCard>
    </AnalyticsContainer>
  );
};

export default Analytics;
