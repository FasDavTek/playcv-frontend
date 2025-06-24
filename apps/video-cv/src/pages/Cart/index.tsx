import React, { useEffect, useState, useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useCart } from '../../context/CartProvider';
import { Box, Checkbox, Paper, Stack, styled, Typography, Alert } from '@mui/material';
import { Button, HtmlContent, useToast } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { deleteData, getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { useAuth } from './../../../../../libs/context/AuthContext'
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';


const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartState, dispatch } = useCart();
  const { authState } = useAuth();
  const [price, setPrice] = useState<number>(0);
  const [cartItem, setCartItem] = useState();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [triggerPayment, setTriggerPayment] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { showToast, dismissToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);


  const ensureNoDuplicates = useCallback((cartItems: any[]) => {
    return cartItems.reduce((acc, item) => {
      const exists = acc.some((i: any) => i.videoCvId === item.videoCvId);
      if (!exists) acc.push(item);
      return acc;
    }, []);
  }, []);


  // useEffect(() => {
  //   if (selectAll) {
  //     setSelectedItems(cartState.cart.map(item => item.id));
  //   } else {
  //     setSelectedItems([]);
  //   }
  // }, [selectAll, cartState.cart]);

  useEffect(() => {
    const validSelectedItems = selectedItems.filter(id => 
      cartState.cart.some(item => item.id === id)
    );
    setSelectedItems(validSelectedItems);
    setSelectAll(validSelectedItems.length === cartState.cart.length && cartState.cart.length > 0);
  }, [cartState.cart]);


  useEffect(() => {
    const newTotalPrice = cartState.cart
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(newTotalPrice);
  }, [selectedItems, cartState.cart]);



  const fetchCart = useCallback(async () => {
    if (authState.isAuthenticated) {
      try {
        if (!token) {
          showToast('Your session has expired. Please log in again', 'error');
          navigate('/')
        };

        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_MY_CART}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.code === '00') {
          // const transformedData = response.data.map((item: {videoCvId: any; id: any; title: any; price: any; thumbnail: any; authorName: any; videoType: any; description: any; quantity: any; }) => ({
          //   id: item.id,
          //   videoCvId: item.videoCvId,
          //   title: item.title,
          //   price: item.price,
          //   imageSrc: item.thumbnail,
          //   uploader: item.authorName,
          //   type: item.videoType,
          //   description: item.description,
          //   quantity: item.quantity,
          // }));
          const uniqueCartItems = ensureNoDuplicates(response.data.map((item: any) => ({
            id: item.id,
            videoCvId: item.videoCvId,
            title: item.title,
            price: item.price,
            imageSrc: item.thumbnail,
            uploader: item.authorName,
            type: item.videoType,
            description: item.description,
            quantity: item.quantity,
          })));
          // setCartItem(transformedData);
          // dispatch({ type: 'SET_CART', payload: transformedData });
          setCartItem(uniqueCartItems);
          dispatch({ type: 'SET_CART', payload: uniqueCartItems });
        }
      } catch (err) {
        showToast('Failed to load cart items', 'error');
      }
    }
  }, [authState.isAuthenticated, token, dispatch, ensureNoDuplicates]);


  useEffect(() => {
    fetchCart();
  }, [fetchCart]);


  const handleRemoveFromCart = async (cartItemId: number) => {
    try {
      const response = await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.REMOVE_FROM_CART}/${cartItemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.code === '00') {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } });
        await fetchCart();
        showToast('Video removed from cart', 'success');
      }
    } catch (err) {
      showToast('Failed to remove video from cart', 'error');
    }
  };


  const onPaymentSuccess = useCallback(async (response: any) => {
    try {
      showToast('Processing payment...', 'info');

      const PaymentDetailsData = {
        userId: authState.user?.id,
        buyerId: authState.user?.id,
        currency: "NGN",
        total: totalPrice,
        amount: totalPrice,
        countryCode: 'NG',
        datetime: new Date().toISOString(),
        reference_Id: response.reference,
        purchaseDetails: selectedItems.map(itemId => {
          const item = cartState.cart.find(cartItem => cartItem.id === itemId);
          return {
            videoId: item?.videoCvId,
            amount: item?.price,
            quantity: 1,
          };
        }),
        status: response.status === 'success' ? 's' : response.status === 'failed' ? 'f' : 'a',
        // cardType: details.cardType || "Unknown",
        // cardDetails: `${details.cardDetails || "Unknown"} ${details.cardType || ""}`,
        // last_Four: details.last_Four || "Unknown",
        paymentType: "purchase",
        userIdentifier: authState.user?.id,
        // transactionFee: details.added_fees || 0,
        // chargedTaxAmount: 0,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, PaymentDetailsData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === "00") {
        try {
          await Promise.all(selectedItems.map(async (id) => {
            await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.REMOVE_FROM_CART}/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }));

          dismissToast();

          setPaymentSuccess(true);

          showToast("Payment successful", 'success');

          // dispatch({ type: 'REMOVE_FROM_CART', payload: selectedItems.map(id => ({ id })) });
          
          // await fetchCart();
          
          // setSelectedItems([]);
          // setSelectAll(false);

          setTimeout(async () => {
            dispatch({ type: 'REMOVE_FROM_CART', payload: selectedItems.map(id => ({ id })) });
            await fetchCart();
            setSelectedItems([]);
            setSelectAll(false);
            setPaymentSuccess(false);
          }, 2000);

        } catch (err) {
          showToast("Payment successful but error updating cart", 'warning');
        }

        await fetchCart();
      }
      else {
        showToast(resp.data?.message, 'error');
      }

    }
    catch (err: any) {
      showToast(err?.response?.data?.message, 'error');
    }

  }, [authState.user, selectedItems, cartState.cart, dispatch, totalPrice, token, fetchCart ]);



  const onPaymentFailure = () => {
    showToast("Payment failed. Please try again.", 'error');
  };


  const { payButtonFn, isProcessing } = usePaystack(onPaymentSuccess, onPaymentFailure);

  const handlePayment = useCallback(() => {
    if (totalPrice > 0) {
      const email = authState?.user?.username || '';
      const userSignupDataString = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER);
      let firstName = '';
      let lastName = '';
      let phone = '';
      if (userSignupDataString) {
        const userSignupData = JSON.parse(userSignupDataString);
        firstName = userSignupData?.surname;
        lastName = userSignupData?.firstName;
        phone = userSignupData?.phoneNumber;
      }

      payButtonFn(totalPrice, email, firstName, lastName, phone);
    }
  }, [authState.user, payButtonFn, totalPrice]);

  // console.log('isAuth', isAuthenticated);
  const handleCheckout = () => {
    if (!authState.isAuthenticated) {
      showToast("Please log in to proceed with checkout", 'info');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    if (selectedItems.length === 0) {
      showToast('Please select items to purchase', 'info');
      return
    }

    handlePayment();
  };

  const ClampedText = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    // textOverflow: 'ellipsis',
  });

  // const handleCheckboxChange = (id: string) => {
  //   if (selectedItems.includes(id)) {
  //     setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  //   } else {
  //     setSelectedItems([...selectedItems, id]);
  //   }
  // };

  // const handleCheckboxChange = (id: number) => {
  //   const newSelectedItems = selectedItems.includes(id)
  //     ? selectedItems.filter((itemId) => itemId !== id)
  //     : [...selectedItems, id]
  //   setSelectedItems(newSelectedItems);

  //   if (newSelectedItems.length === cartState.cart.length) {
  //     setSelectAll(true);
  //   } else {
  //     setSelectAll(false);
  //   }
  // }

  const handleCheckboxChange = (id: number) => {
    const newSelectedItems = selectedItems.includes(id)
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id];
    
    setSelectedItems(newSelectedItems);
    setSelectAll(newSelectedItems.length === cartState.cart.length);
  };


  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedItems(newSelectAll ? cartState.cart.map(item => item.id) : []);
  };


  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      showToast('No items selected for removal', 'info');
      return;
    }

    try {
      await Promise.all(selectedItems.map((id) => handleRemoveFromCart(id)));

      showToast(`${selectedItems.length} item(s) removed from cart`, 'success');
    } catch (err) {
      showToast('Failed to remove items from cart', 'error');
    }
  };

  // TODO: onCheckout, login if not already logged in

  return (
    <div className="min-h-screen px-3 py-5 md:px-5 xl:px-10 flex md:py-10 gap-3 flex-col">
      <div className="w-full md:w-[100%] xl:w-[75%] mx-auto flex flex-col md:flex-row gap-5 md:items-start md:justify-between">
        <div className={`flex-1 ${isSummaryOpen ? 'md:flex-[7]' : 'md:w-full'}`}>
          {paymentSuccess && (
            <Alert severity="info">Check your video management menu for the list of videoCV with their details</Alert>
          )}
          <Typography variant='h4' marginBottom={4}>
             My Cart ({cartState.cart.length})
          </Typography>
          <div className="border py-4 px-3 rounded-lg">
            <Stack direction='row' spacing={3} justifyContent='space-between'>
              <Stack direction='row' alignItems='center' justifyContent='center'>
                <Checkbox color="success" checked={selectAll} onChange={handleSelectAllChange} />
                <Typography variant='body1' fontWeight='550'>
                  Select All
                </Typography>
              </Stack>

              <Button variant='black' label='Delete' className='black' onClick={handleDeleteSelected} disabled={selectedItems.length === 0}></Button>
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
                            {item.title}
                          </Typography>
                          {/* <Typography variant='body1' fontWeight='400'>
                            {item.uploader}
                          </Typography> */}
                          <Typography variant="body2">Type: {item.type}</Typography>
                          <Typography variant='body1' fontWeight='400'>
                            Quantity: 1
                          </Typography>
                          <Box>
                            
                          <ClampedText variant='body2'>
                            <HtmlContent html={item.description} />
                          </ClampedText>
                            
                            {/* <Typography onClick={handleToggle} variant='body2' sx={{ cursor: 'pointer', fontWeight: 'semibold' }} style={{ color: 'white' }}>
                              {isExpanded ? 'Show less' : '...more'}
                            </Typography> */}
                          </Box>
                        </Stack>
                      </div>
                    </Stack>

                    <Stack direction={['row', 'column']} flex={1} flexGrow={1} alignItems={['start', 'flex-end']} className='w-full gap-3 md:justify-between mt-1 md:mt-0' spacing={2}>
                      <Typography>₦ {item.price}</Typography>
                      <div className="">
                        <span role="button" onClick={() => handleRemoveFromCart(item.id)} className="flex items-center border-transparent text-xs font-bold hover:bg-slate-100 rounded-full px-1 py-1 md:px-1 md:py-1">
                          <RemoveShoppingCartIcon className="w-1 h-1" />
                        </span>
                      </div>
                      <Button variant='black' label='Checkout' onClick={() => setIsSummaryOpen(true)} className='black text-sm'></Button>
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
                ₦ {totalPrice}
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
      <div className={`fixed bottom-0 left-0 right-0 bg-white z-30 transition-height rounded-t-xl duration-300 ${isSummaryOpen ? 'h-auto' : 'h-0 overflow-hidden'} md:hidden`}>
        <div className="border flex flex-col gap-3 p-4 rounded-t-xl">
          <h5 className="border-b uppercase px-1 py-0.5">Cart Summary</h5>
          <div className="flex justify-between px-1 py-0.5">
            <p className="px-1 py-0.5">Subtotal</p>
            <p className="">
              ₦ {totalPrice}
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
