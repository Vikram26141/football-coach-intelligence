import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const GetStartedContainer = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 600px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing['2xl']};
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing['2xl']};
`;

const Step = styled(Card)`
  padding: ${theme.spacing.lg};
  text-align: left;
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
`;

const StepTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StepDescription = styled.p`
  color: ${theme.colors.gray[600]};
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const GetStarted = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up for a free Football Coach Intelligence account'
    },
    {
      number: 2,
      title: 'Upload Video',
      description: 'Upload your match footage for AI analysis'
    },
    {
      number: 3,
      title: 'Get Insights',
      description: 'View analytics, heatmaps, and tactical reports'
    }
  ];

  return (
    <GetStartedContainer>
      <Title>Get Started with Football Coach Intelligence</Title>
      <Subtitle>
        Start analyzing your football matches with AI-powered insights in just 3 simple steps.
      </Subtitle>

      <StepsContainer>
        {steps.map((step) => (
          <Step key={step.number}>
            <StepNumber>{step.number}</StepNumber>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Step>
        ))}
      </StepsContainer>

      <ButtonContainer>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => navigate('/signup')}
        >
          Create Account
        </Button>
        <Button 
          variant="secondary" 
          size="lg"
          onClick={() => navigate('/about')}
        >
          Learn More
        </Button>
      </ButtonContainer>
    </GetStartedContainer>
  );
};

export default GetStarted;
