import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Link, Preview } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface PasswordChangeNotificationProps {
  username: string;
}

export const PasswordChangeNotification: React.FC<PasswordChangeNotificationProps> = ({ 
  username 
}) => (
  <Html>
    <Head />
    <Preview>Your password has been changed</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 px-5">
          <Section className="mt-8">
            <Text className="text-2xl font-bold text-gray-800">Hello {username},</Text>
            <Text className="text-gray-700 text-base mt-2">
              This email is to confirm that your password has been successfully changed.
            </Text>
            <Text className="text-gray-700 text-base mt-2">
              If you did not make this change, please contact our support team immediately.
            </Text>
            <Link
              href="https://yourwebsite.com/support"
              className="inline-block px-6 py-3 mt-4 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Contact Support
            </Link>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default PasswordChangeNotification;

