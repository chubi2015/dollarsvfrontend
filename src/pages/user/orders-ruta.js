import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoBagHandle } from "react-icons/io5";
import ReactPaginate from "react-paginate";

//internal import
import useAsync from "@hooks/useAsync";
import Dashboard from "@pages/user/dashboard";
import OrderServices from "@services/OrderServices";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import OrderHistory from "@component/order/OrderHistory";
import { SidebarContext } from "@context/SidebarContext";
import UpdateStatusOrderModal from "@component/modal/UpdateStatusOrderModal";
import ConfirmationModal from "@component/modal/ConfirmationModal";
import SignatureCanvas from "react-signature-canvas";
import { notifyError, notifySuccess } from '@utils/toast';

const OrdersRuta = () => {
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
  const [firma, setFirma] = useState({});
  const [sizeSignture, setSizeSignture] = useState({});
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    CargarDatos();
  }, [currentPage]);

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
      size = { width: width * 0.8, height: height * 0.6 };
    } else {
      size = { width: 500, height: 200 };
    }
    setSizeSignture(size);
  }, []);

  const pageCount = Math.ceil(data?.totalDoc / 8);

  useEffect(() => {
    setIsLoading(false);
    if (!userInfo) {
      router.push("/");
    }
    if (!userInfo.isDeliveryMan) {
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
    const firmaCliente = firma.toData();
    let data = {};
    console.log(firmaCliente);
    if(firmaCliente.length === 0){
      notifyError("Por favor firme la entrega del pedido");
      return;
    }
    if (newStatus === "Entregado") {
      data = { status: newStatus, clientSignature: firmaCliente, DeliveredDate: new Date() };
      OrderServices.updateOrderAdmin(id, data)
      .then((res) => {
        notifySuccess("Pedido entregado con exito");
        CargarDatos();
        setModalConfirmationOpen(false);
        setModalOpen(false);
        OrderServices.sendEmailOrder({
          name: Orden.name, 
          email: Orden.email, 
          numOrden: id, 
          estado: newStatus, 
          subject: "DOLLARSV - Orden "+id.substring(20, 24)+" Actualizada",
          }).then((res) => {
        }).catch((err) => {
          notifyError(err.message);
          setIsCheckoutSubmit(false);
        });
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        notifyError(err.message);
      });
    }
  };
  const CargarDatos = async () => {
    const Estados = ["En Ruta"];
    OrderServices.getOrderAdmin({
      page: currentPage,
      limit: 8,
      status: Estados,
    })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <>
      <UpdateStatusOrderModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        orden={Orden}
        handleChangeStatus={handleChangeStatus}
        options={["En Ruta", "Entregado"]}
        mobile={mobile}
      />
      <ConfirmationModal
        modalOpen={modalConfirmation}
        setModalOpen={setModalConfirmationOpen}
        message={"Esta seguro que quiere cambiar el estado de este pedido?"}
        handleAccept={handleAccept}
      >
        <div style={{ border: 2 }} className="border-b">
          <p>
            Por Favor Firme la entrega del pedido{" "}
            <strong>(Firma del cliente)</strong>
          </p>
          <div className="border border-black" style={sizeSignture}>
            <SignatureCanvas
              penColor="black"
              canvasProps={sizeSignture}
              ref={(e) => {
                setFirma(e);
              }}
            />
          </div>
          <button
            onClick={(e) => {
              firma.clear();
            }}
          >
            Limpiar
          </button>
          {/* <button
              onClick={(e) => {
                setfirmatemp(firma.toData());
              }}
            >
              guardar
            </button>
            <button
              onClick={(e) => {
                firma.fromData(Orden.clientSignature);
              }}
            >
              Cargar
            </button> */}
        </div>
      </ConfirmationModal>

      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Dashboard
          title="My Orders"
          description="This is user order history page"
        >
          <div className="overflow-hidden rounded-md font-serif">
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
                  Ordenes En Ruta
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
                              <OrderHistory order={order} admin={true} mobile={mobile} />
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

export default OrdersRuta;
