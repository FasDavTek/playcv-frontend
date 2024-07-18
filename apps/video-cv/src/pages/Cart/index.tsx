import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useCart } from '../../context/CartProvider';
import { Paper } from '@mui/material';
import { Button } from '@video-cv/ui-components';
import { Icons } from '@video-cv/assets';
import { usePaystack } from '@video-cv/payment';
import { useAuth } from '../../context/AuthProvider';

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

  const handleRemoveFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  // console.log('isAuth', isAuthenticated);
  const handleEmployerSignin = () => {
    // if not signed in, navigate to sign in, append ?next to sign in
    // if signed in, trigger paystack modal
    // TODO: Do sign in logic
    if (isAuthenticated?.authState) {
      payButtonFn();
    }
  };

  // TODO: onCheckout, login if not already logged in

  return (
    <div className="min-h-screen px-10 flex py-10 gap-3 flex-col">
      <div className="w-full md:w-[80%] mx-auto flex flex-col md:flex-row gap-5 md:items-start">
        <div className="md:flex-[7]">
          <div className="border py-1 px-2 ">
            Cart ({cartState.cart.length})
          </div>
          <div className=" flex flex-col gap-3">
            {cartState.cart.map((item: any) => {
              return (
                <Paper
                  // variant="outlined"
                  key={item.id}
                  square={false}
                  className="bg-white p-4 md:p-10 flex justify-between"
                >
                  <div className="left">
                    <div className="up flex gap-2">
                      <img
                        alt=""
                        className=" w-[50px] h-[50px] rounded"
                        src={item.imageSrc}
                      />
                      Name of the video
                    </div>
                    <div className="">
                      <span
                        role="button"
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="border flex items-center gap-1 w-fit border-transparent text-sm font-bold hover:bg-slate-100  rounded-md mt-3 px-2 py-1 md:px-4 md:py-1.5"
                      >
                        <img alt="" className="w-5 h-15" src={Icons.Trash} />
                        Remove
                      </span>
                      {/* <Button
                        variant="neutral"
                        label="Remove"
                        className="mt-4"
                        onClick={() => handleRemoveFromCart(item.id)}
                      /> */}
                    </div>
                  </div>
                  <div className="right">
                    <p className="">₦ {item.price}</p>
                  </div>
                </Paper>
              );
            })}
          </div>
        </div>
        <div className="md:flex-[3] border flex flex-col gap-3">
          <h5 className=" border-b uppercase px-1 py-0.5">Cart Summary</h5>
          <div className="flex justify-between px-1 py-0.5">
            <p className="px-1 py-0.5">Subtotal</p>
            <p className="">
              ₦{' '}
              {cartState.cart.reduce(
                (accumulator: number, currentValue: any) =>
                  accumulator + currentValue.price,
                0
              )}
            </p>
          </div>

          <div className="px-1 py-0.5">
            {/* TODO: If not signed in, navigate to Employer sign in */}
            <Button
              label="Checkout"
              onClick={handleEmployerSignin}
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
