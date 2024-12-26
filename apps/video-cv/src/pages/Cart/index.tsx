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
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';



interface VerifyPaymentResponse {
  status: string;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: any;
      risk_action: string;
    };
    plan: any;
    split: any;
    order_id: string;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    transaction_date: string;
    plan_object: any;
    subaccount: any;
  };
}

export interface PaymentDetails {
  id: number;
  email: string;
  reference: string;
  access_code?: string;
  status: string;
  transaction?: string;
  amount: number;
  currency: string;
  cardType?: string;
  cardDetails?: string;
  last_Four?: string;
  bank?: string;
  channelType?: string;
  paidAt?: string;
  createdAt?: string;
  added_fees?: number;
  duration?: string;
}



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
  const [paymentReference, setPaymentReference] = useState<PaymentDetails | null>(null);



  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token) {
    toast.error('Your session has expired. Please log in again');
    navigate('/')
  };


  const verifyTransaction = async (reference: string): Promise<VerifyPaymentResponse> => {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const verifyPayment = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CONFIG.PAYSTACK}`,
        'Content-Type': 'application/json',
      }
    });

    return await verifyPayment.json();
  }



  const onPaymentInitiated = useCallback(async (reference: string, response: any) => {
    try {
      toast.info('Processing payment...');

      const verifyPayment = await verifyTransaction(reference);
      console.log(verifyPayment);

      if (verifyPayment.data.status === "success") {
        const details: PaymentDetails = {
          id: verifyPayment.data.id,
          reference: verifyPayment.data?.reference,
          // access_code: verifyPayment.data?.access_code,
          amount: verifyPayment.data?.amount,
          currency: verifyPayment.data?.currency,
          email: verifyPayment.data?.customer?.email,
          status: verifyPayment.data?.status,
          // transaction: transaction,
          cardType: verifyPayment.data?.authorization?.card_type,
          cardDetails: `${verifyPayment.data?.authorization?.brand || ''} || ${verifyPayment.data?.authorization?.card_type || ''}`,
          last_Four: verifyPayment.data?.authorization?.last4,
          bank: verifyPayment.data?.authorization?.bank,
          channelType: verifyPayment.data?.channel,
          paidAt: verifyPayment.data?.paid_at,
          createdAt: verifyPayment.data?.created_at,
          added_fees: verifyPayment.data?.fees,
          duration: (verifyPayment.data?.log?.time_spent).toString(),
        };

        console.log(details);

        setPaymentReference(details);

        const PaymentDetailsData = {
          buyerId: authState.user?.id,
          currency: details.currency,
          total: details.amount,
          countryCode: 'NG',
          datetime: details.paidAt || new Date().toISOString(),
          reference_Id: details.reference,
          purchaseDetails: selectedItems.map(itemId => {
            const item = cartState.cart.find(cartItem => cartItem.id === itemId);
            return {
              videoId: item?.id,
              amount: details?.amount,
              quantity: 1,
            };
          }),
          status: details.status,
          cardType: details.cardType || "Unknown",
          cardDetails: `${details.cardDetails || "Unknown"} ${details.cardType || ""}`,
          last_Four: details.last_Four || "Unknown",
          paymentType: "purchase",
          userIdentifier: authState.user?.id,
          transactionFee: details.added_fees || 0,
          chargedTaxAmount: 0,
        };

        const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, PaymentDetailsData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.code === "00") {
          console.log('Payment successful');
          toast.success("Payment successful");
          // Clear cart or remove purchased items
          selectedItems.forEach(id => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } }));
          setSelectedItems([]);
          setSelectAll(false);
        }
        else {
          toast.error("Unable to save payment details");
        }
      }
      else {
        throw new Error('Payment verification failed');
      }
    }
    catch (err) {
      // console.error("Error saving payment details:", error);
      toast.error("An error occurred while saving payment details");
    }

    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  }, [authState.user, navigate, selectedItems, cartState.cart, dispatch, ]);



  const onPaymentFailure = () => {
    console.log('Payment failed');
    toast.error("Payment failed. Please try again.");
  };




  const { payButtonFn, isProcessing } = usePaystack(onPaymentInitiated, onPaymentFailure);

  const handlePayment = useCallback(() => {
    const amount = price;
    const email = authState?.user?.username || '';
    const firstName = authState?.user?.firstName || '';
    const lastName = authState?.user?.lastName || '';
    const phone = authState?.user?.phone;

    if (amount > 0) {
      payButtonFn(amount, email, firstName, lastName, phone);
    }
  }, [authState.user, payButtonFn, price]);

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

    handlePayment();
    
    // payButtonFn();
  };

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
