import dynamic from 'next/dynamic';
/* import Cookies from 'js-cookie'; */
import { useForm } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';

//internal import
/* import Label from '@component/form/Label'; */
import Error from '@component/form/Error';
import Dashboard from '@pages/user/dashboard';
import InputArea from '@component/form/InputArea';
import UserServices from '@services/UserServices';
import { UserContext } from '@context/UserContext';
import { notifySuccess, notifyError } from '@utils/toast';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import OrderServices from '@services/OrderServices';

const CreateShopUser = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setCurrentLocation({ lat, lng });
  };

  const onSubmit = (data) => {

    setLoading(true);

    if (currentLocation === null) {
      notifyError("Por favor seleccion un punto en el mapa");
    }

    const userData = {
      name: data.firstName + " " + data.lastName,
      email: data.email,
      address: data.address,
      phone: data.phone,
      isAdmin: false,
      isDeliveryMan: false,
      isShop: true,
      firstName: data.firstName,
      lastName: data.lastName,
      contact: data.phone,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      companyName: data.companyName,
      nit: data.nit,
      nrc: data.nrc,
      companyCategory: data.companyCategory,
      companyAddress: data.companyAddress,
      currentLocation: currentLocation,
      password: data.Password,
      tag: tagValue
    };
    UserServices.registerShopUser(userData)
      .then((res) => {
        if (res) {
          setLoading(false);
          notifySuccess(res.message);
          if (res.email) {
            setValue("firstName", "")
            setValue("lastName", "")
            setValue("email", "")
            setValue("phone", "")
            setValue("phone", "address")
            setValue("city", "")
            setValue("country", "")
            setValue("zipCode", "")
            setValue("companyName", "")
            setValue("nit", "")
            setValue("nrc", "")
            setValue("companyCategory", "")
            setValue("companyAddress", "")
            setValue("Password", "")
            setTagValue("")
            setCurrentLocation({});
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        notifyError(err ? err?.response?.data?.message : err.message);
      });
  };

  const [tagsOptions, settagsOptions] = useState([]);
  const [tagValue, setTagValue] = useState("");
  const [sizeMap, setsizeMap] = useState({});

  const handleChangeSelect = (e) => {
    const tag = e.target.value;
    setTagValue(tag);
  }

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

    OrderServices.getTagsById("tags")
      .then((res) => {
        if (res[0]) {
          settagsOptions(res[0].tags);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });

  }, []);

  return (
    <Dashboard title="Update-Profile" description="This is edit profile page">
      <div className="max-w-screen-2xl">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-xl font-serif font-semibold mb-5">
                Crear Usurio de Tienda
              </h2>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="mt-10 sm:mt-0">
              <div className="md:grid-cols-6 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="lg:mt-6 mt-4 bg-white">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Nombres"
                          name="firstName"
                          type="text"
                          placeholder="Nombres"
                        />
                        <Error errorName={errors.firstName} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Apellidos"
                          name="lastName"
                          type="text"
                          placeholder="Apellidos"
                        />
                        <Error errorName={errors.lastName} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Tu direccion"
                          name="address"
                          type="text"
                          placeholder="Tu direccion"
                        />
                        <Error errorName={errors.address} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Numero de Celular"
                          name="phone"
                          type="tel"
                          placeholder="Numero de Celular"
                        />
                        <Error errorName={errors.phone} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="Email"
                        />
                        <Error errorName={errors.email} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Ciudad"
                          name="city"
                          type="text"
                          placeholder="Ciudad"
                        />
                        <Error errorName={errors.city} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Pais"
                          name="country"
                          type="text"
                          placeholder="Pais"
                        />
                        <Error errorName={errors.country} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="zipCode"
                          name="zipCode"
                          type="text"
                          placeholder="zipCode"
                        />
                        <Error errorName={errors.zipCode} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Nombre de la empresa"
                          name="companyName"
                          type="text"
                          placeholder="Nombre de la empresa"
                        />
                        <Error errorName={errors.phone} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="NIT"
                          name="nit"
                          type="text"
                          placeholder="NIT"
                        />
                        <Error errorName={errors.email} />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="NRC"
                          name="nrc"
                          type="text"
                          placeholder="NRC"
                        />
                        <Error errorName={errors.nrc} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Categoria"
                          name="companyCategory"
                          type="text"
                          placeholder="Categoria"
                        />
                        <Error errorName={errors.companyCategory} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="direccion de la empresa"
                          name="companyAddress"
                          type="text"
                          placeholder="direccion fisica de la empresa"
                        />
                        <Error errorName={errors.companyAddress} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label="Password"
                          name="Password"
                          type="text"
                          placeholder="Password"
                        />
                        <Error errorName={errors.Password} />
                      </div>

                      <div className="col-span-6 sm:col-span-6">
                        <p>Ubicación Actual</p>
                        {
                          isLoaded ? (
                            <GoogleMap
                              mapContainerStyle={sizeMap}
                              center={currentLocation || center}
                              zoom={10}
                              onLoad={onLoad}
                              onUnmount={onUnmount}
                              onClick={handleMapClick}
                              options={{ streetViewControl: false }}
                            >
                              {currentLocation &&
                                <Marker position={currentLocation}
                                  draggable={true}
                                  onDragEnd={handleMarkerDragEnd} />}
                            </GoogleMap>
                          ) : <></>
                        }
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <p><strong>2-Clientes:</strong></p>
                        <select name="estados" id="estados" defaultValue={""} value={tagValue}
                          onChange={(e) => { handleChangeSelect(e) }}
                          className="w-50 h-10 block border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                          <option value={""} className="py-2">{"Escoga una etiqueta"}</option>
                          {tagsOptions.map((option) => (
                            <option key={option.key} value={option.key} className="py-2">{option.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3 mt-5 text-right">
                      <button
                        disabled={loading}
                        type="submit"
                        className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-emerald-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-emerald-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default dynamic(() => Promise.resolve(CreateShopUser), { ssr: false });
