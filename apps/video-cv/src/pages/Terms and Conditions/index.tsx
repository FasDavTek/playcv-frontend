import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const index: React.FC = () => {
  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" marginBottom='3rem' className="mb-10 text-center font-bold">
          Terms and Conditions
        </Typography>
        
        <Typography variant="h6" marginBottom={'1rem'} className="mb-28 font-bold">
          CONDITIONS OF USE AND SALE
        </Typography>
        
        <Typography paragraph>
          Welcome to The playCV (Video platform). We offer our products and services to you subject to the conditions set out on this page.
          Please read these conditions carefully before using this Video platform website.
        </Typography>
        
        <Typography paragraph className="font-semibold">
          If you do not agree with any part of these Terms, or if you are not eligible or authorized to be bound by the Terms, then do not access or use the Service.
        </Typography>
        
        <Typography paragraph>
          By using this Video platform you signify your agreement to be bound by these terms and conditions.
        </Typography>
        
        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            1. Your Account
          </Typography>
          <Typography paragraph>
            You are responsible for maintaining the confidentiality of your account and password and restricting access to your computer to prevent unauthorized access to your account. You agree to accept all responsibility for all activities that occur under your account or password. You should take all necessary steps to ensure that the password is kept confidential and secure. You should inform this Video platform and its administrators as soon as you have any reason to believe that the password has become known to anyone else, or if the password is being used in an unauthorized way.
          </Typography>
          <Typography paragraph>
            Ensure that the details you provide us with are correct and accurate.
          </Typography>
        </Box>
        
        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            2. Access to The Video platform
          </Typography>
          <Typography paragraph>
            We will do our best to ensure that availability to the website will be uninterrupted and that our transmissions will be error free. But, due to the nature of the Internet, it cannot be 100% guaranteed. Also your access to the Website may be suspended occasionally or restricted to allow for repairs, maintenance, or the introduction of new facilities or services. We will ensure that the frequency and duration of any such inconveniences are greatly reduced.
          </Typography>
        </Box>
        
        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            3. Website Access
          </Typography>
          <Typography paragraph>
            This website or any portion of this site may not be reproduced, copied, duplicated, sold, resold, visited or for any commercial purpose without the written consent of this Video platform.
          </Typography>
          <Typography paragraph>
            You may not frame or use framing techniques to enclose any trademark, Logo, or other proprietary information (images, text, page layout or form) of this Video platform without express consent of this Video platform and its administrators.
          </Typography>
          <Typography paragraph>
            You may not use any hidden text utilizing the playCV (This Video platform) names or trademarks without the express written consent of this Video platform and its administrators.
          </Typography>
        </Box>
        
        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            4. Your Conduct
          </Typography>
          <Typography paragraph>
            - You are encouraged to check the goods or services before payment and to request the seller/service provider to provide documents confirming compliance of the goods or services with applicable requirements of laws, regulations, rules, guidelines, standards.
          </Typography>
          <Typography paragraph>
            - You acknowledge that you are solely responsible for your safety and you understand that you should meet with other individuals for completion of a transaction only in safe public places in daylight hours. You are solely responsible for conducting due diligence of any individual or organization requesting a meeting to conduct a job test / interview or to complete a transaction. If in doubt of any request for job test/ interview, please do not attend. This Video platform and its Administrators disclaim any responsibility for user's interaction with any individual, recruiter, service provider or organization.
          </Typography>
          <Typography paragraph>
            - You must not use the website in any way that causes, or likely to cause the website or access to it to be interrupted, damaged in any way. Endeavour to read every terms and conditions concerning the products/services offered on this website also products or services offered by third party suppliers on the third party suppliers website. You must not use this Video platform for any of the following:
          </Typography>
          <Typography paragraph className="pl-4">
            - For fraud or any fraudulent purposes, or in connection with criminal offence or any unlawful activity.
          </Typography>
          <Typography paragraph className="pl-4">
            - To send, use or re-use any materials of any kind that is illegal, offensive, indecent, abusive, obscene, and defamatory.
          </Typography>
        </Box>
        
        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            5. Disclaimer of Warranties and Liability
          </Typography>
          <Typography paragraph>
            This Video platform and its administrators have no control over and does not guarantee the existence, quality, safety or legality of goods and services published by users on the platform. The trustworthiness or accuracy of information provided by users in the candidate CV section, marketplace, adverts, employer section. The ability of sellers or service providers to sell goods or to provide services, the ability of buyers/corps members to pay for goods or services or that a user will actually complete a transaction. This Video platform and its Administrators make no guarantees concerning that manufacturing, import, export, offer, displaying, purchase, sale, advertising and/or use of products or services, which are offered or displayed on the platform do not infringe any third parties' rights. Therefore, this Video platform and its administrators expressly disclaims any liability in connection to materials and information posted by users on the platform.
          </Typography>
        </Box>
        
        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            6. Privacy Policy and Changes to Terms
          </Typography>
          <Typography paragraph>
            Please also review our Privacy Policy. The terms of the Privacy Policy and other supplemental terms, rules, policies, or documents that may be posted on the Platform from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms at any time and for any reason with or without prior notice.
          </Typography>
        </Box>
        
        <Box component="section" className="mb-6">
          <Typography variant="h6" className="mb-2 font-semibold">
            Governing Law and Jurisdiction
          </Typography>
          <Typography paragraph>
            These terms shall be governed in accordance with the laws of the Federal Republic of Nigeria.
          </Typography>
          <Typography paragraph>
            Any disputes arising out of or in connection with these Terms, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration and conciliation Act of the Federal Republic of Nigeria. The number of arbitrators shall be one. The seat of arbitration shall be Lagos, Nigeria.
          </Typography>
        </Box>
        
        <Typography className="mt-8 text-right italic">
          - The playCV (Video platform) team
        </Typography>
      </Paper>
    </Container>
  );
};

export default index;
