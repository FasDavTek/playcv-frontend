import React, { useState } from 'react';
import { Container, Tab, Tabs, Typography, Box, TextField, Stack } from '@mui/material';
import { Button, Input } from '@video-cv/ui-components';

interface PriceFieldsProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const PriceFields: React.FC<PriceFieldsProps> = ({ label, value, onChange }) => {
  return (
    <Input
    //   fullWidth
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      startAdornment={
        <Typography variant="h6">₦</Typography>
      } 
    />
  );
};

const PaymentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [pinnedVideoPrice, setPinnedVideoPrice] = useState<number>(0);
  const [regularVideoPrice, setRegularVideoPrice] = useState<number>(0);
  const [adsPrice, setAdsPrice] = useState<number>(0);
  const [buyVideoPrice, setBuyVideoPrice] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = () => {
    // Implement save logic here (e.g., sending data to the server)
    console.log({
      pinnedVideoPrice,
      regularVideoPrice,
      adsPrice,
      buyVideoPrice,
    });
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Video Upload Prices" />
          <Tab label="Ads Prices" />
          <Tab label="Buy Video Prices" />
        </Tabs>

        {activeTab === 0 && (
          <Stack direction={{ xs: 'column', md: 'row'}} gap={4} mt={4}>
            <PriceFields label="Pinned Video Upload Price" value={pinnedVideoPrice} onChange={setPinnedVideoPrice} />
            <PriceFields label="Regular Video Upload Price" value={regularVideoPrice} onChange={setRegularVideoPrice} />
          </Stack>
        )}

        {activeTab === 1 && (
          <Box mt={4} maxWidth='sm'>
            <PriceFields label="Ads Price" value={adsPrice} onChange={setAdsPrice} />
          </Box>
        )}

        {activeTab === 2 && (
          <Box mt={4} maxWidth='sm'>
            <PriceFields label="Buy Video Price" value={buyVideoPrice} onChange={setBuyVideoPrice} />
          </Box>
        )}

        <Box mt={4} maxWidth='sm'>
            <Button variant="black" label='Save' onClick={handleSave}></Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentManagement;
