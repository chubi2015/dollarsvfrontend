import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiPlus, FiMinus } from 'react-icons/fi';

import Tags from '@component/common/Tags';
import Stock from '@component/common/Stock';
import Price from '@component/common/Price';
import useAddToCart from '@hooks/useAddToCart';
import MainModal from '@component/modal/MainModal';
import { SidebarContext } from '@context/SidebarContext';
import OrderHistory from '@component/order/OrderHistory';

const ConfirmationModal = ({ modalOpen, setModalOpen, message, handleAccept, children }) => {
  const router = useRouter();
  const { setIsLoading, isLoading } = useContext(SidebarContext);

  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block overflow-y-auto h-full align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <div className="flex flex-col lg:flex-row md:flex-row w-full max-w-4xl overflow-hidden">

          <div className="w-full flex flex-col p-5 md:p-8 text-left">
            <div className="mb-2 md:mb-2.5 block -mt-1.5">
              <h1 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif hover:text-black">
                Confirmar
              </h1>
            </div>
            {children}
            <p className="text-sm leading-6 text-gray-500 md:leading-6">
              {message}
            </p>
            <button className="px-4 py-2 m-2 bg-emerald-100 text-sm text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-semibold rounded-full" onClick={(e) => handleAccept()}>
              Aceptar
            </button>
            <button className="px-4 py-2 m-2 bg-red-100 text-sm text-red-600 hover:bg-red-500 hover:text-white transition-all font-semibold rounded-full" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default React.memo(ConfirmationModal);
