import React, { useContext, useEffect, useState } from 'react';
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
import ReactImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const ProductModal = ({ modalOpen, setModalOpen, product, admin, handleClickUpdate }) => {
  const router = useRouter();
  const { setIsLoading, isLoading } = useContext(SidebarContext);
  const { handleAddItem, setItem, item } = useAddToCart();

  const handleMoreInfo = (slug) => {
    setModalOpen(false);

    router.push(`/product/${slug}`);
    setIsLoading(!isLoading);
  };

  const [cantidad, setCantidad] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(()=>{
    setCantidad(product.quantity);
    setItems([
      {
        original: product.image,
        thumbnail: product.image,
      },
      {
        original: product.image2,
        thumbnail: product.image2,
      },
      {
        original: product.image3,
        thumbnail: product.image3,
      },
      {
        original: product.image4,
        thumbnail: product.image4,
      }
    ]);
  },[product]);

  const handlerestarQuantity = () =>{
    setCantidad((old)=>old-1);
  }

  const handlesumarQuantity = () =>{
    setCantidad((old)=>old+1);
  }

  const handleClickUpdateandclose = () =>{
    if(admin){
    handleClickUpdate({...product, quantity: cantidad});
    setModalOpen(false);
    }
    else{
      handleAddItem(product)
    }
  }

  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block overflow-y-auto h-full align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <div className="flex flex-col lg:flex-row md:flex-row w-full max-w-4xl overflow-hidden">
          <div
            //onClick={() => handleMoreInfo(product.slug)}
            className="flex-shrink-0 flex items-center justify-center h-auto cursor-pointer"
          >
            {/* <Image
              src={product.image}
              width={420}
              height={420}
              alt={product.title}
            /> */}
            <ReactImageGallery
              items={items}
              autoPlay={false}
            />
          </div>

          <div className="w-full flex flex-col p-5 md:p-8 text-left">
            <div className="mb-2 md:mb-2.5 block -mt-1.5">
              <h1 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif hover:text-black cursor-pointer">
                {product.title}
              </h1>

              <Stock product={product} />
            </div>
            <p className="text-sm leading-6 text-gray-500 md:leading-6">
              {product.description}
            </p>
            <div className="flex items-center mt-4">
              <Price product={product} />
            </div>

            <div className="flex items-center mt-4">
              <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 md:h-12 border-gray-300">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      admin?handlerestarQuantity():setItem(item - 1)}}
                    disabled={admin?cantidad === 0:item === 1}
                    className="flex items-center justify-center flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-e border-gray-300 hover:text-gray-500"
                  >
                    <span className="text-dark text-base">
                      <FiMinus />
                    </span>
                  </button>
                  <p className="font-semibold flex items-center justify-center h-full  transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-base text-heading w-8  md:w-20 xl:w-24">
                    {admin?cantidad:item}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      admin?handlesumarQuantity():setItem(item + 1)}}
                    disabled={
                     admin?false:cantidad < item || product.quantity === item
                    }
                    className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-s border-gray-300 hover:text-gray-500"
                  >
                    <span className="text-dark text-base">
                      <FiPlus />
                    </span>
                  </button>
                </div>
                <button
                  onClick={(e) => {e.preventDefault();
                    handleClickUpdateandclose();}}
                  disabled={admin?false:product.quantity < 1}
                  className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-4 ml-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white bg-emerald-500 hover:bg-emerald-600 w-full h-12"
                >
                  {admin?"Actualizar":"Agregar Al Carrito"}
                </button>
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                <div>
                  <span className="font-serif font-semibold py-1 text-sm d-block">
                    <span className="text-gray-700">Categoria:</span>{' '}
                    <span className="text-gray-500">{product.children}</span>
                  </span>

                  <Tags product={product} />
                </div>
                {admin?<></>:<div>
                  <button
                    onClick={() => handleMoreInfo(product.slug)}
                    className="font-sans font-medium text-sm text-orange-500"
                  >
                    Mas Información
                  </button>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default React.memo(ProductModal);
