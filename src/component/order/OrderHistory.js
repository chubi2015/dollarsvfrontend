import React from 'react';
import dayjs from 'dayjs';
import { addIVA, extraerIVA, roundNumber } from '@utils/dataManage';

const OrderHistory = ({ order, admin, mobile }) => {
  return (
    <>
      {mobile?<></>:<td className="px-5 py-3 leading-6 whitespace-nowrap">
        <span className="uppercase text-sm font-medium">
          {order._id.substring(20, 24)}
        </span>
      </td>}
      {admin ? <td className="px-5 py-3 leading-6 whitespace-nowrap">
        <span className="uppercase text-sm font-medium">
          {order.name}
        </span>
      </td> : <></>}
      {/* {mobile?<></>:<td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">
          {dayjs(order.createdAt).format('MMMM D, YYYY')}
        </span>
      </td>}
      {mobile?<></>:<td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">
          {dayjs(order.scheDeliveryDate?order.scheDeliveryDate:order.arrivedDate).format('MMMM D, YYYY')}
        </span>
      </td>} */}
      {mobile?<></>:<td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">{order.paymentMethod}</span>
      </td>}
      {mobile?<></>:<td className="px-5 py-3 leading-6 text-center whitespace-nowrap font-medium text-sm">
        {order.status === 'Entregado' && (
          <span className="text-emerald-500">{order.status}</span>
        )}
        {order.status === 'Procesando' && (
          <span className="text-yellow-500">{order.status}</span>
        )}
        {order.status === 'En Ruta' && (
          <span className='text-blue-500' >{order.status}</span>
        )}
        {order.status === 'Cancelado' && (
          <span className="text-red-500">{order.status}</span>
        )}
        {order.status === 'Entrega Programada' && (
          <span className="text-purple-500">{order.status}</span>
        )}
      </td>}
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm font-bold">
          ${roundNumber(/* extraerIVA(order.total)+ */order.total)}
        </span>
      </td>
    </>
  );
};

export default OrderHistory;
