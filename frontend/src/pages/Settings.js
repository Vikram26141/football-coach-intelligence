import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from '../components/UI/Button';

const SettingsContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const SettingsCard = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[200]};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const SettingsSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[800]};
  margin-bottom: ${theme.spacing.md};
`;

const Settings = () => {
  return (
    <SettingsContainer>
      <Title>Settings</Title>
      
      <SettingsCard>
        <SettingsSection>
          <SectionTitle>Profile Settings</SectionTitle>
          <p>Manage your account and profile information.</p>
          <Button variant="outline" size="md">
            Edit Profile
          </Button>
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>Analysis Preferences</SectionTitle>
          <p>Configure your analysis settings and preferences.</p>
          <Button variant="outline" size="md">
            Configure
          </Button>
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>Notifications</SectionTitle>
          <p>Manage your notification preferences.</p>
          <Button variant="outline" size="md">
            Manage
          </Button>
        </SettingsSection>
      </SettingsCard>
    </SettingsContainer>
  );
};

export default Settings;
