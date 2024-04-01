import React from 'react';
import MainModal from '@component/modal/MainModal';
import OrderHistory from '@component/order/OrderHistory';
import OrderStatus from '@component/order/OrderStatus';

const StatusModal = ({ modalOpen, setModalOpen, orden, handleChangeStatus, options, children, mobile, readOnly }) => {
  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen} mobile={mobile}>
      <div className="inline-block overflow-y-auto h-full align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-x-auto">
        <div className="flex flex-col lg:flex-row md:flex-row w-full max-w-4xl overflow-hidden">
          <div className="w-full flex flex-col p-5 md:p-8 text-left">
            <div className="mb-2 md:mb-2.5 block -mt-1.5">
              <h1 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif hover:text-black">
                {!readOnly ? "Actualizar Estado" : "Estado"}
              </h1>
            </div>
            <OrderStatus orden={orden} mobile={mobile} />
            {!readOnly ?
              <table className="table-auto min-w-full max-h-screen w-full border border-gray-100 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="bg-gray-100">
                    {mobile ? <></> : <th
                      scope="col"
                      className="text-left text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                    >
                      ID
                    </th>}
                    <th
                      scope="col"
                      className="text-left text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    {/* {mobile ? <></> : <th
                    scope="col"
                    className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                  >
                    Fecha
                  </th>}
                  {mobile ? <></> : <th
                    scope="col"
                    className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                  >
                    Fecha de envio
                  </th>} */}
                    {mobile ? <></> : <th
                      scope="col"
                      className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                    >
                      Metodo de pago
                    </th>}
                    {mobile ? <></> : <th
                      scope="col"
                      className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                    >
                      Estado
                    </th>}
                    <th
                      scope="col"
                      className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                    >
                      Nuevo Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <OrderHistory order={orden} admin={true} mobile={mobile} />
                    <th>
                      <select name="estados" id="estados" defaultValue={orden.status}
                        onChange={(e) => { handleChangeStatus(orden, e.target.value) }}
                        className="w-3/4 h-10 block py-2 px-1 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                        {options.map((option) => (
                          <option key={option} value={option} className="py-2">{option}</option>
                        ))}
                      </select>
                    </th>
                  </tr>
                </tbody>
              </table>
              : <></>}
            {children}
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default React.memo(StatusModal);
