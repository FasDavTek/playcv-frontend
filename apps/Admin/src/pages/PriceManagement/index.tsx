import React, { useState } from 'react';
import { Container, Tab, Tabs, Typography, Box, TextField, Stack } from '@mui/material';
import { Button, Input } from '@video-cv/ui-components';
import { toast } from 'react-toastify';

interface PriceFieldsProps {
  label: string;
  value: number | undefined;
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
      placeholder='0'
      startAdornment={
        <Typography variant="h6">₦</Typography>
      } 
    />
  );
};

const index: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [pinnedVideoPrice, setPinnedVideoPrice] = useState<number | undefined>();
  const [regularVideoPrice, setRegularVideoPrice] = useState<number | undefined>();
  const [adsPrice, setAdsPrice] = useState<number | undefined>();
  const [buyVideoPrice, setBuyVideoPrice] = useState<number | undefined>();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
  };
  

  const handleSave = () => {
    if (pinnedVideoPrice !== undefined) {
        const formattedPinnedPrice = formatCurrency(pinnedVideoPrice);
        localStorage.setItem('pinnedVideoPrice', formattedPinnedPrice);
    }

    if (regularVideoPrice !== undefined) {
        const formattedRegularPrice = formatCurrency(regularVideoPrice);
        localStorage.setItem('regularVideoPrice', formattedRegularPrice);
    }

    if (adsPrice !== undefined) {
        const formattedAdsPrice = formatCurrency(adsPrice);
        localStorage.setItem('adsPrice', formattedAdsPrice);
    }

    if (buyVideoPrice !== undefined) {
        const formattedBuyPrice = formatCurrency(buyVideoPrice);
        localStorage.setItem('buyVideoPrice', formattedBuyPrice);
    }

    console.log({
        pinnedVideoPrice: formatCurrency(pinnedVideoPrice || 0),
        regularVideoPrice: formatCurrency(regularVideoPrice || 0),
        adsPrice: formatCurrency(adsPrice || 0),
        buyVideoPrice: formatCurrency(buyVideoPrice || 0),
    });

    toast.success('Prices saved successfully!');

    setPinnedVideoPrice(0);
    setRegularVideoPrice(0);
    setAdsPrice(0);
    setBuyVideoPrice(0);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" TabIndicatorProps={{ sx: { bgcolor: 'primary.main', height: '100%', borderRadius: 2, zIndex: -1, }, }} sx={{ borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none', minWidth: 100, fontWeight: 'bold', color: 'text.secondary', '& .Mui-selected': { color: 'primary.main' }, }, '& .MuiTabs-flexContainer': { gap: 2 }, }}>
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

export default index;