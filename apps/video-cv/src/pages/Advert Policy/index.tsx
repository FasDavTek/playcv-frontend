import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';

const index: React.FC = () => {
  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" marginBottom='3rem' className="mb-10 text-center font-bold">
          Advert Policy
        </Typography>

        <Box component="section" className="mb-6">
          <Typography variant="h6" marginBottom={'1rem'} className="mb-28 font-bold">
            Advert Placements/Publisher's rights
          </Typography>
          <Typography paragraph>
            There are three categories of this video platform targeting plan. 
            Advertisers can select the section (homepage, marketplace etc) that meets the desired audience profile. 
            The system delivers the adverts to the pages that match the section requested. 
            This way, advertisers have complete control over where their advertising message is delivered, 
            so that their products or services reach those who would most likely be interested.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="All advertising is subject to approval from the videoCV portal regarding subject matter, form, size, wording, illustrations and typography." />
            </ListItem>
            <ListItem>
              <ListItemText primary="This Video platform reserves the right to reposition, classify, edit, reject or cancel any advertisement at any time, before or after placement if it falls below acceptable standards." />
            </ListItem>
            <ListItem>
              <ListItemText primary="We do not accept online advertising for massages, escort services, astrology, X-rated movies or items. Neither will we knowingly accept advertising for books, motion picture or product involved in pending litigation." />
            </ListItem>
            <ListItem>
              <ListItemText primary="The advertiser agrees to indemnify this VideoCV platform, its officers, and business partners against any expense or loss by reason of any claim arising from the online publishing of the advert." />
            </ListItem>
            <ListItem>
              <ListItemText primary="We reserve the right to change advert prices, but adverts currently running are protected from price increase until the advert run expires. The advert run starts the day it appears on the portal, and runs for the duration paid/contracted for." />
            </ListItem>
            <ListItem>
              <ListItemText primary="All advertising must be paid in advance. Adverts not paid for, will not appear on the website." />
            </ListItem>
          </List>
        </Box>

        <Box component="section" className="mb-6">
          <Typography variant="h6" marginBottom={'.5rem'} className="mb-2 font-semibold">
            Identification and Indemnification
          </Typography>
          <Typography paragraph>
            Advertisers must have either their company's registered URL or name in one of the frames of the advert. 
            Under no circumstances do we accept advertising without identifying the company.
          </Typography>
          <Typography paragraph>
            This Video platform, its administrators and business partners shall in no way be liable for any cost or damage 
            if for any reason it fails to publish the advertisement on the portal due to a breach of our policy. 
            In no event shall this Video platform, its administrators and business partners be liable for any damage of any kind 
            as a result of any mistake in the advert or for any other unforeseen reason.
          </Typography>
          <Typography paragraph>
            This Video platform, its administrators, and business partners will not be liable for delays in delivering adverts 
            or the non-delivery of adverts in the event of riots, strikes (legal or illegal), action of any governmental agency, 
            Internet interruption, shutdown, blackout, stoppage (legal or illegal) of any kind, embargos, fires, floods, earthquakes, 
            volcanoes, hurricanes or any other Act of God beyond the control of the portal, its administrators and business partners.
          </Typography>
        </Box>

        <Box component="section" className="mb-6">
          <Typography variant="h6" marginBottom={'.5rem'} className="mb-2 font-semibold">
            Contact Us for Advertising
          </Typography>
          <Typography paragraph>
            Thank you for opting for the playCV (Video) platform as an advertising medium to reach your teeming customers/clients. 
            You want to expand the reach of your product/service to the graduate youth market?
          </Typography>
          <Typography paragraph className='font-extrabold'>
            Then contact us for Advert details:
          </Typography>
          <Typography paragraph className='font-extrabold'>
            Tel: 07065245969 (WhatsApp chat)
          </Typography>
          <Typography paragraph className='font-extrabold'>
            E-mail: contact@nyscjobs.ng
          </Typography>
          <Typography paragraph>
            Chat to us, we will send our advert rates to your e-mail box or you can find our rates on the platform.
          </Typography>
        </Box>

        <Typography className="mt-8 text-right italic">
          Regards
        </Typography>
      </Paper>
    </Container>
  );
};

export default index;

