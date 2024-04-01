import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { CardElement } from '@stripe/react-stripe-js';
import Link from 'next/link';
import {
  IoReturnUpBackOutline,
  IoArrowForward,
  IoBagHandle,
  IoWalletSharp,
} from 'react-icons/io5';
import { ImCreditCard } from 'react-icons/im';

//internal import
import Layout from '@layout/Layout';
import Label from '@component/form/Label';
import Error from '@component/form/Error';
import CartItem from '@component/cart/CartItem';
import InputArea from '@component/form/InputArea';
import InputShipping from '@component/form/InputShipping';
import InputPayment from '@component/form/InputPayment';
import useCheckoutSubmit from '@hooks/useCheckoutSubmit';
import { addIVA, extraerIVA, roundNumber, sumarDiasLaborables } from '@utils/dataManage';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TextField, Tooltip } from "@material-ui/core";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
/* import CheckoutMap from '@component/checkout/CheckoutMap'; */
import { UserContext } from '@context/UserContext';

const Checkout = () => {
  const {
    handleSubmit,
    submitHandler,
    handleShippingCost,
    register,
    errors,
    showCard,
    setShowCard,
    error,
    stripe,
    couponInfo,
    couponRef,
    handleCouponCode,
    discountAmount,
    shippingCost,
    total,
    isEmpty,
    items,
    cartTotal,
    isCheckoutSubmit,
    setArrivedDate,
    showCreditoFiscal,
    setShowCreditoFiscal,
    setValue,
    setgeoLocationPoint
  } = useCheckoutSubmit();

  const {
    state: { userInfo },
  } = useContext(UserContext);

  const [recivedDate, setrecivedDate] = useState(sumarDiasLaborables(new Date(), 3));
  const [checkSame, setcheckSame] = useState(false);

  const center = {
    lat: 13.701330,
    lng: -89.224267
  };
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const [isShop, setisShop] = useState(false);
  const [imgMap, setimgMap] = useState("");

  const setMyLocation = () => {
    // Obtén la ubicación actual del navegador
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
      setgeoLocationPoint({ lat: latitude, lng: longitude });
    });
  };

  const onLoad = React.useCallback(function callback(map) {
    map.setZoom(15)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const handleMarkerDragEnd = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setCurrentLocation({ lat, lng });
    setgeoLocationPoint({ lat, lng });
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setCurrentLocation({ lat, lng });
    setgeoLocationPoint({ lat, lng });
  };

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (permissionStatus.state !== 'granted') {
            setPermissionError(true);
          }
        })
        .catch(error => {
          console.error('Error checking geolocation permission:', error);
        });
    }
    if(userInfo.isShop){
      setisShop(userInfo.isShop);
      setShowCreditoFiscal(userInfo.isShop);
      setCurrentLocation(userInfo.currentLocation);
      setgeoLocationPoint(userInfo.currentLocation);
      if(userInfo.currentLocation){
        const lat = userInfo.currentLocation.lat;
        const lng = userInfo.currentLocation.lng;
        setimgMap(`https://maps.googleapis.com/maps/api/staticmap?center=${lat}%2c%20${lng}&zoom=16&size=400x400&markers=color:red:S%7C${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
      }
     }
  }, []);

  const handleChangeDate = (newDate) => {
    const nuevaFecha = new Date(newDate);
    setrecivedDate(nuevaFecha);
    setArrivedDate(nuevaFecha);
  }

  const handlecopyData = (event) => {
    const { checked } = event.target;
    setcheckSame(checked);
    if (checked) {
      const firstName = document.getElementById("firstName");
      const address = document.getElementById("address");
      setValue("companyName", firstName.value);
      setValue("companyAddress", address.value);
    }
    else {
      setValue("companyName", "");
      setValue("companyAddress", "");
    }
  }

  const [sizeMap, setsizeMap] = useState({});

  useEffect(() => {
    const width = window.screen.width;
    const height = window.screen.height;

    let size = {};
    const ismobile = (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i));
    if (ismobile) {
      size = { width: width * 0.9, height: height * 0.6 };
    } else {
      size = { width: 500, height: 500 };
    }
    setsizeMap(size);
  }, []);

  return (
    <>
      <Layout title="Checkout" description="this is checkout page">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
            <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="form-group">
                    <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                      01. Informacion Personal
                    </h2>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Nombres"
                          name="firstName"
                          type="text"
                          placeholder="John"
                        />
                        <Error errorName={errors.firstName} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Apellidos"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                        />
                        <Error errorName={errors.lastName} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="youremail@gmail.com"
                        />
                        <Error errorName={errors.email} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Numero Telefonico"
                          name="contact"
                          type="tel"
                          placeholder="+062-6532956"
                        />

                        <Error errorName={errors.contact} />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mt-12">
                    <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                      02. Detalles de envio
                    </h2>

                    <div className="grid grid-cols-6 gap-6 mb-8">
                      <div className="col-span-6">
                        <InputArea
                          register={register}
                          label="Direccion"
                          name="address"
                          type="text"
                          placeholder="123 Boulevard Rd, Beverley Hills"
                          disabled={isShop}
                        />
                        <Error errorName={errors.address} />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <InputArea
                          register={register}
                          label="Ciudad"
                          name="city"
                          type="text"
                          placeholder="Los Angeles"
                          disabled={isShop}
                        />
                        <Error errorName={errors.city} />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <InputArea
                          register={register}
                          label="Pais"
                          name="country"
                          type="text"
                          placeholder="United States"
                          value="El Salvador"
                          disabled={isShop}
                        />
                        <Error errorName={errors.country} />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <InputArea
                          register={register}
                          label="ZIP / Postal"
                          name="zipCode"
                          type="text"
                          placeholder="2345"
                          disabled={isShop}
                        />
                        <Error errorName={errors.zipCode} />
                      </div>

                    </div>

                    <Label label="Envio" />
                    <div className="grid grid-cols-6 gap-6">
                      {/*  <div className="col-span-6 sm:col-span-3">
                        <InputShipping
                          handleShippingCost={handleShippingCost}
                          register={register}
                          value="Recoger en tienda"
                          time="Lunes-Viernes de 8:00 a.m. a 5:00 p.m."
                          cost={0}
                        />
                        <Error errorName={errors.shippingOption} />
                      </div> */}

                      <div className="col-span-6 sm:col-span-3">
                        <InputShipping
                          handleShippingCost={handleShippingCost}
                          register={register}
                          value="Envio a domicilio"
                          time="minimo 3 dias laborales costo varia con la distancia"
                          cost={0}
                        />
                        <Error errorName={errors.shippingOption} />
                      </div>
                    </div>
                    <br />
                    <Label label="Fecha que desea recibir el pedido" />
                    <div className="grid grid-cols-3 gap-1">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                          name="fecha"
                          label="Fecha"
                          format="dd/MM/yyyy"
                          value={recivedDate}
                          onChange={handleChangeDate}
                          showDaysOutsideCurrentMonth
                          textField={(params) => <TextField {...params} />}
                          disablePast
                          minDate={sumarDiasLaborables(new Date(), 3)}
                          shouldDisableDate={(date) => {
                            return (date.getDay() === 6 || date.getDay() === 0);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <Label label="Ubicacion en mapa" />
                    {permissionError && (
                      <div>
                        <span className="text-xs text-red-400 mb-1">
                          No tienes permisos para acceder a la ubicación. Por favor, otorga permisos para continuar.
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-1">
                      {
                        isShop?
                        <img src={imgMap}/>
                        :isLoaded ? (
                          <GoogleMap
                            mapContainerStyle={sizeMap}
                            center={currentLocation || center}
                            zoom={10}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            onClick={handleMapClick}
                            options={{streetViewControl: false}}
                          >
                            {currentLocation &&
                              <Marker position={currentLocation}
                                draggable={true}
                                onDragEnd={handleMarkerDragEnd} />}
                          </GoogleMap>
                        ) : <></>
                      }
                      
                    </div>
                   {isShop?<></>: <button onClick={(e) => {
                      e.preventDefault();
                      setMyLocation();
                    }}>

                      <a className="px-3 py-1 bg-emerald-100 text-xs text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-semibold rounded-full">
                        Ubicacion actual {currentLocation && <span className="text-xs text-emerald-600 hover:text-white transition-all font-semibold rounded-full"> {currentLocation.lat} {currentLocation.lng}</span>}
                      </a>
                    </button>} 

                  </div>

                  <div className="form-group mt-12">
                    <h2 className="font-semibold font-serif text-base text-gray-700 pb-3">
                      03. Detalles de pago
                    </h2>
                    {showCard && (
                      <div className="mb-3">
                        <CardElement />{' '}
                        <p className="text-red-400 text-sm mt-1">{error}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-6 gap-6">
                      {isShop?<></>:<div className="col-span-6 sm:col-span-3">
                        <InputPayment
                          setShowCard={setShowCreditoFiscal}
                          register={register}
                          name="Consumidor Final"
                          value="Consumidor Final"
                          Icon={IoWalletSharp}
                        />
                        <Error errorName={errors.paymentMethod} />
                      </div>}
                      <div className="col-span-6 sm:col-span-3">
                        <InputPayment
                          setShowCard={setShowCreditoFiscal}
                          register={register}
                          name="Credito Fiscal"
                          value="Credito Fiscal"
                          Icon={IoWalletSharp}
                        />
                        <Error errorName={errors.paymentMethod} />
                      </div>
                      {/* <div className="col-span-6 sm:col-span-3">
                        <InputPayment
                          setShowCard={setShowCard}
                          register={register}
                          name="Credit Card"
                          value="Card"
                          Icon={ImCreditCard}
                        />
                        <Error errorName={errors.paymentMethod} />
                      </div> */}
                    </div>
                    {showCreditoFiscal && (<>
                      <br />
                      <p className="font-semibold font-serif text-base text-gray-700 pb-3">Complemente la información para credito fiscal</p>
                      {!isShop?<Tooltip title="Marque esta opcion si desea utilizar el mismo nombre y direccion de la informacion de contacto" placement="top" >
                        <label className="inline-flex items-center ">
                          <input
                            type="checkbox"
                            name="iguales"
                            className="form-checkbox text-emerald-500"
                            checked={checkSame}
                            onChange={handlecopyData}
                          />
                          <span className="ml-2">Nombres iguales</span>
                        </label>
                      </Tooltip>:<></>}
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label="Nombres Sociedad"
                            name="companyName"
                            type="text"
                            disabled={isShop}
                          />
                          <Error errorName={errors.companyName} />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label="NIT"
                            name="nit"
                            type="text"
                            disabled={isShop}
                          />
                          <Error errorName={errors.nit} />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label="NRC"
                            name="nrc"
                            type="text"
                            disabled={isShop}
                          />
                          <Error errorName={errors.nrc} />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label="Categoria del contribuyente"
                            name="companyCategory"
                            type="text"
                            disabled={isShop}
                          />
                          <Error errorName={errors.companyCategory} />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <InputArea
                            register={register}
                            label="Direccion"
                            name="companyAddress"
                            type="text"
                            disabled={isShop}
                          />
                          <Error errorName={errors.companyAddress} />
                        </div>
                      </div>
                    </>
                    )}
                  </div>

                  <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                    <div className="col-span-6 sm:col-span-3">
                      <Link href="/">
                        <a className="bg-indigo-50 border border-indigo-100 rounded py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-300 transition-all flex justify-center font-serif w-full">
                          <span className="text-xl mr-2">
                            <IoReturnUpBackOutline />
                          </span>
                          Continue Shopping
                        </a>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex-order flex-col h-full md:sticky lg:sticky top-28 md:order-2 lg:order-2">
              <div className="border p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
                <h2 className="font-semibold font-serif text-lg pb-4">
                  Resumen del pedido
                </h2>

                <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-gray-50 block">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}

                  {isEmpty && (
                    <div className="text-center py-10">
                      <span className="flex justify-center my-auto text-gray-500 font-semibold text-4xl">
                        <IoBagHandle />
                      </span>
                      <h2 className="font-medium font-serif text-sm pt-2 text-gray-600">
                        No se han agregado articulos!
                      </h2>
                    </div>
                  )}
                </div>

                {/* <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-heading last:border-b-0 last:text-base last:pb-0">
                  <form className="w-full">
                    {couponInfo.couponCode ? (
                      <span className="bg-emerald-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                        {' '}
                        <p className="text-emerald-600">Coupon Applied </p>{' '}
                        <span className="text-red-500 text-right">
                          {couponInfo.couponCode}
                        </span>
                      </span>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start justify-end">
                        <input
                          ref={couponRef}
                          type="text"
                          placeholder="Input your coupon code"
                          className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-md h-12 duration-200 bg-white border-gray-200 focus:ring-0 focus:outline-none focus:border-emerald-500 placeholder-gray-500 placeholder-opacity-75"
                        />
                        <button
                          onClick={handleCouponCode}
                          className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-emerald-500 h-12 text-sm lg:text-base w-full sm:w-auto"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </form>
                </div> */}
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                  Subtotal
                  <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                    ${roundNumber(cartTotal - extraerIVA(cartTotal))}
                  </span>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                  IVA
                  <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                    ${roundNumber(extraerIVA(cartTotal))}
                  </span>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                  Costo de envio
                  <span className="ml-auto flex-shrink-0 text-gray-800 font-bold">
                    ${roundNumber(shippingCost)}
                  </span>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-500 last:border-b-0 last:text-base last:pb-0">
                  Descuento
                  <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
                    ${roundNumber(discountAmount)}
                  </span>
                </div>
                <div className="border-t mt-4">
                  <div className="flex items-center font-bold font-serif justify-between pt-5 text-sm uppercase">
                    Total
                    <span className="font-serif font-extrabold text-lg">
                      {' '}
                      ${roundNumber(Number(/* extraerIVA(cartTotal) + */ total))}
                    </span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="col-span-6 sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isEmpty || !stripe || isCheckoutSubmit}
                    className="bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 transition-all rounded py-3 text-center text-sm font-serif font-medium text-white flex justify-center w-full"
                  >
                    {isCheckoutSubmit ? (
                      <span className="flex justify-center text-center">
                        {' '}
                        <img
                          src="/spinner.gif"
                          alt="Loading"
                          width={20}
                          height={10}
                        />{' '}
                        <span className="ml-2">Processing</span>
                      </span>
                    ) : (
                      <span className="flex justify-center text-center">
                        {' '}
                        {isShop?"Crear Pedido"
                        :<>
                        Pagar
                        <span className="text-xl ml-2">
                          {' '}
                          <IoArrowForward />
                        </span>
                        </>}
                      </span>
                    )}
                  </button>
                </div>
              </form>
              <div className="col-span-6 sm:col-span-3 text-center">
                <span className="text-xs text-gray-400 mb-1">
                  Se acepta unicamente pago en tarjeta
                </span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default dynamic(() => Promise.resolve(Checkout), { ssr: false });
