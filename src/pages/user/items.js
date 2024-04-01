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
import ProductServices from "@services/ProductServices";
import ProductCard from "@component/product/ProductCard";

const Items = () => {
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
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});

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
        if (newStatus !== "Cancelado") {
          OrderServices.sendEmailOrder({
            name: Orden.name,
            email: Orden.email,
            numOrden: id,
            estado: newStatus,
            subject: "Culinaria - Orden " + id.substring(20, 24) + " Actualizada",
            fecha: dayjs(EntregaProgramada).format('MMMM D, YYYY')
          }).then((res) => {
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
  const CargarDatos = async () => {
    const products = await ProductServices.getShowingProducts();
    setLoading(false);
    setProductos(products);

  };
  const [recivedDate, setrecivedDate] = useState(new Date());

  const handleChangeDate = (newDate) => {
    const nuevaFecha = new Date(newDate);
    setrecivedDate(nuevaFecha);
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

const handleClickUpdate = (producto) => {
  setProducto(producto);
  ProductServices.updateProductBySlug(producto._id, producto).then((response)=>{
    notifySuccess(response.message);
    CargarDatos();
  }).catch((err) => {
    notifyError(err.message);
  });
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
                  Productos
                </h2>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">

                      <div className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
                        <div className="flex">
                          <div className="w-full">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                              {productos?.map((product) => (
                                <ProductCard key={product._id} product={product} admin={true} setProducto={setProducto} handleClickUpdate={handleClickUpdate} />
                              ))}
                            </div>
                          </div>
                        </div>
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

export default Items;
