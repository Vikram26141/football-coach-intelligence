import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from '../components/UI/Button';
import Logo from '../components/UI/Logo';

const LandingContainer = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 600px;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing['2xl']};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      <Content>
        <HeroSection>
          <HeroContent>
            <Logo size="large" spacing={theme.spacing.xl} />
            <Title>Football Coach Intelligence</Title>
            <Subtitle>
              AI-powered football analytics platform. Upload videos, get analysis.
            </Subtitle>
            <ButtonContainer>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/get-started')}
              >
                Get Started
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact
              </Button>
            </ButtonContainer>
          </HeroContent>
        </HeroSection>
      </Content>
    </LandingContainer>
  );
};

export default About;
