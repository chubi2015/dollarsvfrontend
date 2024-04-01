import React from "react";

const StatusCheckbox = ({ checkedStatuses, handleCheckboxChange }) => {
  return (
    <div className="flex flex-wrap items-center space-x-2">
      <div className="font-bold">1-Estatus:</div>
      <div className="w-full sm:w-1/2 md:w-auto">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="Procesando"
            className="form-checkbox text-yellow-500"
            checked={checkedStatuses.Procesando}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2">Procesando</span>
        </label>
      </div>
      <div className="w-full sm:w-1/2 md:w-auto">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="EntregaProgramada"
            className="form-checkbox text-purple-500"
            checked={checkedStatuses.EntregaProgramada}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2">Entrega Programada</span>
        </label>
      </div>
      <div className="w-full sm:w-1/2 md:w-auto">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="EnRuta"
            className="form-checkbox text-blue-500"
            checked={checkedStatuses.EnRuta}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2">En Ruta</span>
        </label>
      </div>
      <div className="w-full sm:w-1/2 md:w-auto">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="Entregado"
            className="form-checkbox text-emerald-500"
            checked={checkedStatuses.Entregado}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2">Entregado</span>
        </label>
      </div>
      <div className="w-full sm:w-1/2 md:w-auto">
        <label className="inline-flex items-center ">
          <input
            type="checkbox"
            name="Cancelado"
            className="form-checkbox text-red-500"
            checked={checkedStatuses.Cancelado}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2">Cancelado</span>
        </label>
      </div>
    </div>
  );
};

export default StatusCheckbox;
