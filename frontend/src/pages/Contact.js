import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import toast from 'react-hot-toast';

const ContactContainer = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg};
  }
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.gray[600]};
  margin: 0;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  font-family: inherit;
  color: ${theme.colors.gray[800]};
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  outline: none;
  resize: vertical;

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <PageTitle>Contact Us</PageTitle>
        <PageSubtitle>
          Get in touch with our team for support or inquiries
        </PageSubtitle>
      </ContactHeader>

      <Card padding>
        <ContactForm onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg }}>
            <Input
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              icon="👤"
              required
            />
            <Input
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              icon="📧"
              required
            />
          </div>
          
          <Input
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleInputChange}
            icon="💬"
            required
          />

          <div>
            <label style={{ 
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary,
              marginBottom: theme.spacing.sm
            }}>
              Message *
            </label>
            <TextArea
              name="message"
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
          >
            Send Message
          </Button>
        </ContactForm>
      </Card>
    </ContactContainer>
  );
};

export default Contact;
