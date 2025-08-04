import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useAuth } from '../services/AuthContext';
import Button from '../components/UI/Button';

const ProfileContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const ProfileCard = styled.div`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[200]};
  padding: ${theme.spacing.lg};
`;

const UserInfo = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const InfoItem = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[700]};
  display: inline-block;
  width: 120px;
`;

const Value = styled.span`
  color: ${theme.colors.gray[600]};
`;

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <ProfileContainer>
        <Title>Profile</Title>
        <ProfileCard>
          <p>Please sign in to view your profile.</p>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Title>Profile</Title>
      
      <ProfileCard>
        <UserInfo>
          <InfoItem>
            <Label>Username:</Label>
            <Value>{user.username}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Email:</Label>
            <Value>{user.email}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Display Name:</Label>
            <Value>{user.display_name || user.username}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Member Since:</Label>
            <Value>{new Date(user.created_at).toLocaleDateString()}</Value>
          </InfoItem>
        </UserInfo>

        <Button variant="primary" size="md">
          Edit Profile
        </Button>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
