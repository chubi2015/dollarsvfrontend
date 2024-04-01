import React from 'react';
import { IconContext } from 'react-icons';
import { AiFillCheckCircle, AiFillClockCircle, AiFillCar, AiFillCloseCircle } from 'react-icons/ai';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Tooltip } from "@material-ui/core";
import { FaMapMarkerAlt } from 'react-icons/fa';

const OrderStatus = ({ orden, mobile }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Procesando':
        return <AiFillClockCircle />;
      case 'Entrega Programada':
        return <AiFillCar />;
      case 'En Ruta':
        return <AiFillCar />;
      case 'Entregado':
        return <AiFillCheckCircle />;
      case 'Cancelado':
        return <AiFillCloseCircle />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Procesando':
        return 'text-yellow-500';
      case 'Entrega Programada':
        return 'text-purple-500';
      case 'En Ruta':
        return 'text-blue-500';
      case 'Entregado':
        return 'text-emerald-500';
      case 'Cancelado':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const transformDate = (date) => {
    return date ? dayjs(date).format('MMMM D, YYYY') : "N/A"
  }

  const buildTittleTip = (status) => {
    switch (status) {
      case 'Procesando':
        return "Fecha Creacion: " + transformDate(orden.createdAt) + "\n" + "Fecha Solicitada: " + transformDate(orden.arrivedDate)
      case 'Entrega Programada':
        return "Fecha Programada: " + transformDate(orden.scheDeliveryDate);
      case 'En Ruta':
        return "Fecha Programada: " + transformDate(orden.scheDeliveryDate);
      case 'Entregado':
        return "Fecha Entregada: " + transformDate(orden.DeliveredDate);
      case 'Cancelado':
        return "Fecha Cancelada: " + transformDate(orden.updatedAt);
      default:
        return 'text-gray-500';
    }
  }

  const orderSteps = [
    'Procesando',
    'Entrega Programada',
    'En Ruta',
    'Entregado'
  ];

  return (<>
    <div className="flex flex-wrap items-center space-x-2">
      <IconContext.Provider value={{ className: 'text-xl' }}>
        {mobile ? <>
          <div className={classNames('flex items-center', getStatusColor(orden.status))}>
            {getStatusIcon(orden.status)}
            <span className="ml-1">{orden.status}</span>
          </div>
        </>
          : <>
            {
              orderSteps.map((step, index) => (
                <Tooltip title={buildTittleTip(step)} placement="top">
                  <div key={step} className={classNames('flex items-center', step === orden.status ? getStatusColor(orden.status) : orden.status === "Cancelado" ? "text-red-500" : 'text-gray-500')}>
                    {getStatusIcon(step)}
                    <span className="ml-1">{step}</span>
                    {index < orderSteps.length - 1 && <div className="mx-2 h-2 bg-gray-300 w-8" />}
                  </div>
                </Tooltip>
              ))
            }
            {orden.status === "Cancelado" ? (<>
              <Tooltip title={buildTittleTip("Cancelado")} placement="top">
                <div className='flex items-center'>
                  <div className="mx-2 h-2 bg-gray-300 w-8" />
                  <div className={classNames('flex items-center', getStatusColor(orden.status))}>
                    {getStatusIcon(orden.status)}
                    <span className="ml-1">{orden.status}</span>
                  </div>
                </div>
              </Tooltip>
            </>) : <></>}</>}
      </IconContext.Provider>
    </div>
    {orden.status === "En Ruta" ?(<div>
      <FaMapMarkerAlt className="map-icon" />
        <a target="_blank"
          jstcache="6"
          //href={`http://maps.google.com/maps?saddr=${orden.geoLocationPoint.lat},${orden.geoLocationPoint.lng}&daddr=${orden.geoLocationPoint.lat},${orden.geoLocationPoint.lng}&17z`}
          href={`https://www.google.com/maps/dir/${orden.geoLocationPoint.lat},${orden.geoLocationPoint.lng}/${orden.geoLocationPoint.lat},${orden.geoLocationPoint.lng}/@${orden.geoLocationPoint.lat},${orden.geoLocationPoint.lng},16z`}
          tabindex="0">
          <span>Google Maps</span>
        </a>
      </div>):<></>}
    </>
  );
};

export default OrderStatus;
