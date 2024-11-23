import React, { useEffect, useState, useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useCart } from '../../context/CartProvider';
import { Box, Checkbox, Paper, Stack, styled, Typography } from '@mui/material';
import { Button } from '@video-cv/ui-components';
import { Icons } from '@video-cv/assets';
import { usePaystack } from '@video-cv/payment';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { useAuth } from './../../../../../libs/context/AuthContext'

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartState, dispatch } = useCart();
  const { authState } = useAuth();
  const [price, setPrice] = useState<number>(0);
  const [triggerPayment, setTriggerPayment] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);


  const onPaymentSuccess = async (response: any) => {
    try {
      toast.info('Processing payment...');
      payButtonFn();

      if (!paymentDetails) {
        throw new Error('Payment failed or was cancelled');
      }
      
      const PaymentDetailsData = {
        buyerId: authState.user?.id,
        currency: paymentDetails.currency,
        total: paymentDetails.amount,
        countryCode: 'NG',
        datetime: paymentDetails.paidAt || new Date().toISOString(),
        reference_Id: paymentDetails.reference,
        purchaseDetails: selectedItems.map(itemId => {
          const item = cartState.cart.find(cartItem => cartItem.id === itemId);
          return {
            videoId: item?.id,
            amount: paymentDetails?.amount,
          };
        }),
        status: paymentDetails.status,
        cardType: paymentDetails.cardType || "Unknown",
        cardDetails: `${paymentDetails.cardBrand || "Unknown"} ${paymentDetails.cardType || ""}`,
        last_Four: paymentDetails.last4 || "Unknown",
        paymentType: "purchase",
        userIdentifier: authState.user?.email,
        transactionFee: paymentDetails.fees || 0,
        chargedTaxAmount: 0,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, PaymentDetailsData);
      if (resp.ok) {
        console.log('Payment successful');
        // toast.success("Payment details saved successfully");
        // Clear cart or remove purchased items
        selectedItems.forEach(id => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } }));
        setSelectedItems([]);
        setSelectAll(false);
      }
      else {
        toast.error("Unable to save payment details");
      }
    }
    catch (err) {
      // console.error("Error saving payment details:", error);
      toast.error("An error occurred while saving payment details");
    }

    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  };



  const onPaymentFailure = () => {
    console.log('Payment failed');
    toast.error("Payment failed. Please try again.");
  };




  const { payButtonFn, paymentDetails, isProcessing } = usePaystack(
    price,
    onPaymentSuccess,
    onPaymentFailure
  );

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(cartState.cart.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, cartState.cart]);


  useEffect(() => {
    const newTotalPrice = cartState.cart
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.price, 0);
    setPrice(newTotalPrice);
  }, [selectedItems, cartState.cart]);


  const handleRemoveFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  // console.log('isAuth', isAuthenticated);
  const handleCheckout = () => {
    if (!authState.isAuthenticated) {
      toast.info("Please log in to proceed with checkout");
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    if (selectedItems.length === 0) {
      toast.info('Please select items to purchase');
    }

    const paymentConfig = {
      email: authState.user?.email || '',
      amount: price * 100, // Paystack expects amount in kobo
      metadata: {
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: authState.user?.id || ''
          }
        ]
      }
    };
    
    payButtonFn();
  };

  useEffect(() => {
    if (triggerPayment) {
      payButtonFn();
      setTriggerPayment(false);
    }
  }, [price, triggerPayment, payButtonFn]);

  const ClampedText = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    // textOverflow: 'ellipsis',
  });

  const handleCheckboxChange = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => {
      handleRemoveFromCart(id);
    });
    setSelectedItems([]);
    setSelectAll(false);
  };

  // TODO: onCheckout, login if not already logged in

  return (
    <div className="h-screen px-3 py-5 md:px-5 xl:px-10 flex md:py-10 gap-3 flex-col">
      <div className="w-full md:w-[100%] xl:w-[75%] mx-auto flex flex-col md:flex-row gap-5 md:items-start md:justify-between">
        <div className={`flex-1 ${isSummaryOpen ? 'md:flex-[7]' : 'md:w-full'}`}>
          <Typography variant='h4' marginBottom={4}>
             My Cart ({cartState.cart.length})
          </Typography>
          <div className="border py-4 px-3 rounded-lg">
            <Stack direction='row' spacing={3} justifyContent='space-between'>
              <Stack direction='row' alignItems='center' justifyContent='center'>
                <Checkbox color="success" checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />
                <Typography variant='body1' fontWeight='550'>
                  Select All
                </Typography>
              </Stack>

              <Button variant='black' label='Delete' className='black' onClick={handleDeleteSelected}></Button>
            </Stack>
          </div>
          <div className=" flex flex-col py-2 gap-3">
            {cartState.cart.map((item: any) => {
              return (
                <Box key={item.id} className="bg-white p-2 md:px-5 md:py-3 flex rounded-lg shadow-sm border border-gray-100 justify-between">
                  <Stack direction={['column', 'row']} alignItems='center' width='100%' className="flex">
                    <Stack direction={['column', 'row']} alignItems='flex-start' width={['100%', '90%']}>
                      <Checkbox color="success" checked={selectedItems.includes(item.id)} onChange={() => handleCheckboxChange(item.id)} />
                      <div className="flex gap-2 items-center w-full">
                        <img alt="" className=" w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-xl" src={item.imageSrc}/>
                        <Stack className='' width='85%' spacing={1}>
                          <Typography variant='subtitle1'>
                            Frontend Developer
                          </Typography>
                          <Typography variant='body1' fontWeight='400'>
                            Lorem Ipsum
                          </Typography>
                          <Box>
                            
                          <ClampedText variant='body2'>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
                          </ClampedText>
                            
                            {/* <Typography onClick={handleToggle} variant='body2' sx={{ cursor: 'pointer', fontWeight: 'semibold' }} style={{ color: 'white' }}>
                              {isExpanded ? 'Show less' : '...more'}
                            </Typography> */}
                          </Box>
                        </Stack>
                      </div>
                    </Stack>

                    <Stack direction={['row', 'column']} flex={1} flexGrow={1} alignItems={['start', 'flex-end']} className='w-full gap-3 md:justify-between mt-1 md:mt-0' spacing={2}>
                      <Typography className={`${isSummaryOpen ? 'flex' : 'hidden'}`}>₦ {item.price}</Typography>
                      <div className="">
                        <span role="button" onClick={() => handleRemoveFromCart(item.id)} className="flex items-center border-transparent text-xs font-bold hover:bg-slate-100 rounded-full px-1 py-1 md:px-1 md:py-1">
                          <RemoveShoppingCartIcon className="w-1 h-1" />
                        </span>
                      </div>
                      <Button variant='black' label='Connect' onClick={() => setIsSummaryOpen(true)} className='black text-sm'></Button>
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </div>
        </div>
        {isSummaryOpen && (
          <div className="md:flex-[3] border flex-col gap-3 hidden md:flex">
            <h5 className="border-b uppercase px-1 py-0.5">Cart Summary</h5>
            <div className="flex justify-between px-1 py-0.5">
              <p className="px-1 py-0.5">Subtotal</p>
              <p className="">
                ₦{price}
              </p>
            </div>
            <div className="px-1 py-0.5">
              <Button
                type='submit'
                variant='black'
                label="Checkout"
                onClick={handleCheckout}
                className="w-full"
              />
            </div>
          </div>
        )}
        
      </div>

      {/* MOBILE CHECKOUT */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white z-10 transition-height rounded-t-xl duration-300 ${isSummaryOpen ? 'h-auto' : 'h-0 overflow-hidden'} md:hidden`}>
        <div className="border flex flex-col gap-3 p-4 rounded-t-xl">
          <h5 className="border-b uppercase px-1 py-0.5">Cart Summary</h5>
          <div className="flex justify-between px-1 py-0.5">
            <p className="px-1 py-0.5">Subtotal</p>
            <p className="">
              ₦{price}
            </p>
          </div>
          <div className="px-1 py-0.5">
            <Button
              type='submit'
              variant='black'
              label="Checkout"
              onClick={handleCheckout}
              className="w-full"
            />
          </div>
        </div>
      </div>
      {/* Items in cart */}
    </div>
  );
};

export default Cart;
