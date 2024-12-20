import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Link, Preview } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface EmailConfirmationProps {
  username: string;
  confirmationLink: string;
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ 
  username, 
  confirmationLink 
}) => (
  <Html>
    <Head />
    <Preview>Confirm your email address</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 px-5">
          <Section className="mt-8">
            <Text className="text-2xl font-bold text-gray-800">Hello {username},</Text>
            <Text className="text-gray-700 text-base mt-2">
              Thank you for signing up! Please confirm your email address by clicking the link below:
            </Text>
            <Link
              href={confirmationLink}
              className="inline-block px-6 py-3 mt-4 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Confirm Email
            </Link>
            <Text className="text-gray-700 text-sm mt-4">
              If you didn't create an account, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailConfirmation;

