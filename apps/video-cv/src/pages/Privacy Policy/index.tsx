import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';

const index: React.FC = () => {
  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" marginBottom='3rem' className="mb-10 text-center font-bold">
          Privacy Policy
        </Typography>

        <Typography paragraph>
          This Video platform takes your privacy seriously. Please read the following to learn more about our privacy policy. 
          We are here to serve your interest.
        </Typography>

        <Typography paragraph className="font-semibold">
          You accept this Privacy Policy when you sign up for, access, or use the playCV Video platform, products and services 
          offered on this portal and all related sites and applications. If you continue to use this portal, you are agreeing 
          to comply with and be bound by the terms and conditions of use.
        </Typography>

        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            Areas This Privacy Policy Covers
          </Typography>
          <Typography paragraph>
            This Privacy Policy covers how this Video platform treats personal information that it collects and receives. 
            Personal information includes your name, address, e-mail address, phone number, pictures, Videos etc.
          </Typography>
          <Typography paragraph>
            This Policy does not apply to the practices of organisations beyond the control of this Video platform, 
            partner organizations, third party entities or to people not under the employ of this Video platform.
          </Typography>
        </Box>

        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            Information Collection and Use
          </Typography>
          <Typography paragraph>
            The playCV (Video platform) collects personal information when you register. When you use our products or services. 
            When you take part in special promos.
          </Typography>
          <Typography paragraph>
            This Video platform collects information about your transactions with us and some of our business partners. 
            We collect information about your use of financial products or services that we offer like in the e-commerce / 
            marketplace section and any other product or service we offer.
          </Typography>
          <Typography paragraph>
            This Video platform uses information for the following general purposes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="To fulfill your requests for products and services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To customize the advertising and content you see" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To contact you when the need arises" />
            </ListItem>
            <ListItem>
              <ListItemText primary="For research purposes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="For anonymous reporting for Internal and external clients" />
            </ListItem>
          </List>
        </Box>

        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            Children or Minors
          </Typography>
          <Typography paragraph>
            This Video platform does not contact children under age 16 about special offers or for marketing purposes 
            without a parent's permission.
          </Typography>
          <Typography paragraph>
            This Video platform does not ask a child under 16 for more personal information, as a condition of participation, 
            than it is necessary to participate in a given activity or promotion.
          </Typography>
        </Box>

        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            Sharing and Disclosure of Information
          </Typography>
          <Typography paragraph>
            This Video platform does not rent, sell or share personal information about you with other people except to provide 
            products or services you've requested, when we have your permission, or under the following circumstances:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="We respond to subpoenas, court orders, or legal processes, or to establish or exercise our legal rights or defend against legal claims." />
            </ListItem>
            <ListItem>
              <ListItemText primary="We believe it is imperative to share information in order to investigate, prevent, or take action regarding illegal activities, suspected fraud, threats to the physical safety of any person, violations of this Video platform terms of use, or as otherwise required by law." />
            </ListItem>
          </List>
        </Box>

        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            Confidentiality and Security
          </Typography>
          <Typography paragraph>
            We have physical, electronic and procedural safeguards that comply with regulations to protect personal information about you. 
            We ensure all personal information transmitted to our portal are Secure Socket Layer (SSL) encryption secure.
          </Typography>
          <Typography paragraph>
            We limit access to personal information about you to employees who we believe reasonably need to come into contact 
            with that information to provide products or services to you or in other to do their jobs.
          </Typography>
          <Typography paragraph>
            No data transmission over the internet or any wireless network can be guaranteed to be perfectly secured. 
            As a result, while we strive to protect your personal information using commercially available and standard encryption technology, 
            we cannot ensure or guarantee the security of any information you transmit to us, and you do so at your own risk.
          </Typography>
        </Box>

        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            Changes to this Privacy Policy
          </Typography>
          <Typography paragraph>
            This Video platform may update this policy. We reserve the right to amend or modify this privacy policy at any time. 
            We will notify you about significant changes in the way we treat personal information by placing a prominent notice on our site.
          </Typography>
          <Typography paragraph>
            If you have questions or suggestions, please complete a feedback form or you can contact us at:
          </Typography>
          <Typography paragraph className="font-semibold">
            Contact@nyscjobs.ng
          </Typography>
        </Box>

        <Typography className="mt-8 text-right">
          Effective Date: August 31, 2024.
        </Typography>
      </Paper>
    </Container>
  );
};

export default index;

