import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoBagHandle } from "react-icons/io5";
import ReactPaginate from "react-paginate";

//internal import
/* import useAsync from "@hooks/useAsync"; */
import Dashboard from "@pages/user/dashboard";
import OrderServices from "@services/OrderServices";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import OrderHistory from "@component/order/OrderHistory";
import { SidebarContext } from "@context/SidebarContext";
import UpdateStatusOrderModal from "@component/modal/UpdateStatusOrderModal";
import ConfirmationModal from "@component/modal/ConfirmationModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { notifyError, notifySuccess } from "@utils/toast";
import StatusCheckbox from "@component/admin/StatusCheckbox";
import SignatureCanvas from "react-signature-canvas";
import dayjs from 'dayjs';

const OrdersAdmin = () => {
  const router = useRouter();
  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { currentPage, handleChangePage, isLoading, setIsLoading } =
    useContext(SidebarContext);

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [Orden, setOrden] = useState({});
  const [modalConfirmation, setModalConfirmationOpen] = useState(false);
  const [newStatus, setnewStatus] = useState("");
  const [checkedStatuses, setCheckedStatuses] = useState({
    Entregado: false,
    Procesando: true,
    EnRuta: true,
    Cancelado: false,
    EntregaProgramada: true,
  });
  const [sizeSignture, setSizeSignture] = useState({});
  const [mobile, setMobile] = useState(false);
  const [tagsOptions, settagsOptions] = useState([]);
  const [tagValue, setTagValue] = useState("");
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
    setMobile(ismobile);
    if (ismobile) {
      size = { width: width * 0.8, height: height * 0.4 };
    } else {
      size = { width: 500, height: 500 };
    }
    setSizeSignture(size);
  }, []);

  useEffect(() => {
    const Estados = getCheckedStatusesNames(checkedStatuses);
    CargarDatos(Estados);
  }, [currentPage]);

  const pageCount = Math.ceil(data?.totalDoc / 8);

  useEffect(() => {
    setIsLoading(false);
    if (!userInfo) {
      router.push("/");
    }
    if (!userInfo.isAdmin) {
      router.push("/");
    }
  }, [userInfo]);

  function handleChangeStatus(orden, e) {
    if (orden.status !== e) {
      setnewStatus(e);
      setModalConfirmationOpen(true);
    }
  }
  const handleAccept = async () => {
    const id = Orden._id;
    const EntregaProgramada = recivedDate;
    let data = {};
    if (newStatus === "Entrega Programada") {
      data = { status: newStatus, scheDeliveryDate: EntregaProgramada };
    } else {
      data = { status: newStatus };
    }
    OrderServices.updateOrderAdmin(id, data)
      .then((res) => {
        notifySuccess("Se actualizo el estado del pedido");
        const Estados = getCheckedStatusesNames(checkedStatuses);
        CargarDatos(Estados);
        setModalConfirmationOpen(false);
        setModalOpen(false);
        if(newStatus !== "Cancelado"){
          OrderServices.sendEmailOrder({
            name: Orden.name, 
            email: Orden.email, 
            numOrden: id, 
            estado: newStatus, 
            subject: "Culinaria - Orden "+id.substring(20, 24)+" Actualizada",
            fecha: dayjs(EntregaProgramada).format('MMMM D, YYYY')}).then((res) => {
          }).catch((err) => {
            notifyError(err.message);
            setIsCheckoutSubmit(false);
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        notifyError(err.message);
      });
  };
  const CargarDatos = async (Estados, tag) => {
    OrderServices.getOrderAdmin({
      page: currentPage,
      limit: 8,
      status: Estados,
      tag: tag
    })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });

      OrderServices.getTagsById("tags")
        .then((res) => {
          if(res[0]){
            settagsOptions(res[0].tags);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
  };
  const [recivedDate, setrecivedDate] = useState(new Date());

  const handleChangeDate = (newDate) => {
    const nuevaFecha = new Date(newDate);
    setrecivedDate(nuevaFecha);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedStatuses((prevCheckedStatuses) => ({
      ...prevCheckedStatuses,
      [name]: checked,
    }));
    setTagValue("");
  };

  useEffect(() => {
    handleChangechecks();
  }, [checkedStatuses]);

  const handleChangechecks = () => {
    CargarDatos(getCheckedStatusesNames(checkedStatuses));
  };

  const getCheckedStatusesNames = (checkedStatuses) => {
    const checkedStatusesNames = [];
    for (const [key, value] of Object.entries(checkedStatuses)) {
      if (value) {
        if (key === "EnRuta") {
          checkedStatusesNames.push("En Ruta");
        } else if (key === "EntregaProgramada") {
          checkedStatusesNames.push("Entrega Programada");
        } else {
          checkedStatusesNames.push(key);
        }
      }
    }
    return checkedStatusesNames;
  };

  const handleChangeSelect = (e) =>{
    const tag = e.target.value;
    setTagValue(tag);
    CargarDatos(getCheckedStatusesNames(checkedStatuses), tag);
  }

  return (
    <>
      <UpdateStatusOrderModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        orden={Orden}
        handleChangeStatus={handleChangeStatus}
        options={[
          "Procesando",
          "Entrega Programada",
          "En Ruta",
          "Entregado",
          "Cancelado",
        ]}
        mobile={mobile}
      >
        {Orden.status === "Entregado" ? (
          <>
            <div style={{ border: 2 }} className="border-b">
              <p>Firma del cliente</p>
              <div
                className="border border-black"
                style={sizeSignture}
              >
                <SignatureCanvas
                  penColor="black"
                  canvasProps={sizeSignture}
                  ref={(e) => {
                    if (e !== null) {
                      e.fromData(Orden.clientSignature);
                      e.off();
                    }
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </UpdateStatusOrderModal>
      <ConfirmationModal
        modalOpen={modalConfirmation}
        setModalOpen={setModalConfirmationOpen}
        message={"Esta seguro que quiere cambiar el estado de este pedido?"}
        handleAccept={handleAccept}
      >
        {newStatus === "Entrega Programada" ? (
          <div>
            <p>
              Por Favor ingrese la fecha de envio programada para este pedido
            </p>
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
                minDate={new Date(Orden.arrivedDate)}
                shouldDisableDate={(date) => {
                  return date.getDay() === 6 || date.getDay() === 0;
                }}
              />
            </LocalizationProvider>
          </div>
        ) : (
          <></>
        )}
      </ConfirmationModal>

      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Dashboard
          title="My Orders"
          description="This is user order history page"
        >
          <div className="overflow-hidden rounded-md font-serif">
            <div className="flex flex-row justify-between items-center mb-5">
              <StatusCheckbox
                checkedStatuses={checkedStatuses}
                handleCheckboxChange={handleCheckboxChange}
              ></StatusCheckbox>
            </div>
            <div className="flex flex-row justify-start items-center mb-5">
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
            {loading ? (
              <Loading loading={loading} />
            ) : error ? (
              <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
                {error}
              </h2>
            ) : data?.orders?.length === 0 ? (
              <div className="text-center">
                <span className="flex justify-center my-30 pt-16 text-emerald-500 font-semibold text-6xl">
                  <IoBagHandle />
                </span>
                <h2 className="font-medium text-md my-4 text-gray-600">
                  Aun no se a realizado ninguna orden!
                </h2>
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-xl font-serif font-semibold mb-5">
                  Ordenes
                </h2>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                      <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr className="bg-gray-100">
                            {mobile?<></>:<th
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
                            {/* {mobile?<></>:<th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Fecha
                            </th>}
                            {mobile?<></>:<th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Fecha de envio
                            </th>} */}
                            {mobile?<></>:<th
                              scope="col"
                              className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Metodo de pago
                            </th>}
                            {mobile?<></>:<th
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
                              className="text-right text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Detalles
                            </th>
                            <th
                              scope="col"
                              className="text-right text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                            >
                              Actualizar
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data?.orders?.map((order) => (
                            <tr key={order._id}>
                              <OrderHistory order={order} admin={true} mobile={mobile}/>
                              <td className="px-5 py-3 whitespace-nowrap text-right text-sm">
                                <Link href={`/order/${order._id}`}>
                                  <a className="px-3 py-1 bg-emerald-100 text-xs text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-semibold rounded-full">
                                    Detalles
                                  </a>
                                </Link>
                              </td>
                              <td className="px-10 py-0 whitespace-nowrap text-right text-sm">
                                <button
                                  className=""
                                  onClick={() => {
                                    setOrden(order);
                                    setModalOpen(true);
                                    setrecivedDate(new Date(order.arrivedDate));
                                  }}
                                >
                                  <a className="px-3 py-1 bg-emerald-100 text-xs text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-semibold rounded-full">
                                    Actualizar
                                  </a>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="paginationOrder">
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel="Next"
                          onPageChange={(e) => handleChangePage(e.selected + 1)}
                          pageRangeDisplayed={3}
                          pageCount={pageCount}
                          previousLabel="Previous"
                          renderOnZeroPageCount={null}
                          pageClassName="page--item"
                          pageLinkClassName="page--link"
                          previousClassName="page-item"
                          previousLinkClassName="page-previous-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-next-link"
                          breakClassName="page--item"
                          breakLinkClassName="page--link"
                          containerClassName="pagination"
                          activeClassName="activePagination"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dashboard>
      )}
    </>
  );
};

export default OrdersAdmin;
