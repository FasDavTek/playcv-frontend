import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useCart } from '../../context/CartProvider';
import { Box, Checkbox, Paper, Stack, styled, Typography } from '@mui/material';
import { Button } from '@video-cv/ui-components';
import { Icons } from '@video-cv/assets';
import { usePaystack } from '@video-cv/payment';
import { useAuth } from '../../context/AuthProvider';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const Cart = () => {
  const navigate = useNavigate();
  const { cartState, dispatch } = useCart();
  const isAuthenticated = useAuth();
  const { payButtonFn } = usePaystack(
    () => {
      console.log('onSuccess callback');
      navigate('/dashboard');
    },
    () => {
      console.log('onFailure callback');
    }
  );

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(cartState.cart.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, cartState.cart]);

  const handleRemoveFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  // console.log('isAuth', isAuthenticated);
  const handleCheckout = () => {
    // if not signed in, navigate to sign in, append ?next to sign in
    // if signed in, trigger paystack modal
    // TODO: Do sign in logic
    if (isAuthenticated?.authState?.isAuthenticated) {
      if (isAuthenticated.authState.userType === 'employer') {
        payButtonFn();
      } else if (isAuthenticated.authState.userType === 'job-seeker') {
        // Handle job-seeker specific logic, for example:
        navigate('/auth/login');
      }
    } else {
      navigate('/auth/login');
    }
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

  const totalPrice = cartState.cart
    .filter(item => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.price, 0);

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
                ₦{' '}{totalPrice}
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
              ₦{' '}{totalPrice}
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
