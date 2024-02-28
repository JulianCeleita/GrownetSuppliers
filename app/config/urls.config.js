//BASE URL
const PRODUCTION_BASE_URL = "https://api.grownetapp.com/grownet/api/";
const QA_BASE_URL = "http://3.139.16.141/api/";

// login
export const loginUrl = `${QA_BASE_URL}login/login`;

// users
export const usersUrl = `${QA_BASE_URL}user/all`;

// Products
export const productsUrl = `${QA_BASE_URL}products/all`;
export const addProductUrl = `${QA_BASE_URL}products/create`;
export const updateProductUrl = `${QA_BASE_URL}products/update/`;
export const deleteProductUrl = `${QA_BASE_URL}products/delete/`;

//Presentations
export const presentationsUrl = `${QA_BASE_URL}presentations/all`;
export const presentationsSupplierUrl = `${QA_BASE_URL}presentations/supplier/`;
export const addPresentationUrl = `${QA_BASE_URL}presentations/create`;
export const updatePresentationUrl = `${QA_BASE_URL}presentations/update/`;
export const deletePresentationUrl = `${QA_BASE_URL}presentations/delete/`;

//Categories
export const categoriesUrl = `${QA_BASE_URL}categories/all`;
export const addCategoryUrl = `${QA_BASE_URL}categories/created`;
export const updateCategoryUrl = `${QA_BASE_URL}categories/updated/`;
export const deleteCategoryUrl = `${QA_BASE_URL}categories/delete/`;

//Suppliers
export const suppliersUrl = `${QA_BASE_URL}suppliers/all`;
export const addSupplierUrl = `${QA_BASE_URL}suppliers/create`;
export const updateSupplierUrl = `${QA_BASE_URL}suppliers/update/`;
export const deleteSupplierUrl = `${QA_BASE_URL}suppliers/delete/`;

//Families
export const familiesUrl = `${QA_BASE_URL}families/all`;

//UOM
export const uomUrl = `${QA_BASE_URL}uom/all`;

//Taxes
export const taxexUrl = `${QA_BASE_URL}taxes/all`;

//Orders
export const ordersUrl = `${QA_BASE_URL}orders/all`;
export const ordersSupplierUrl = `${QA_BASE_URL}orders/supplier/`;
export const orderDetail = `${QA_BASE_URL}orders/`;
export const restaurantsData = `${QA_BASE_URL}customers/all`;
export const createOrders = `${QA_BASE_URL}orders/create`;
export const ordersDate = `${QA_BASE_URL}orders/search/date`;
export const customerSupplier = `${QA_BASE_URL}customers/supplier/`;

export const printInvoices = `${QA_BASE_URL}invoice/generate`;

export const customersData = `${QA_BASE_URL}customers/serch/`;

export const presentationsCode = `${QA_BASE_URL}presentations/search/`;

export const presentationData = `${QA_BASE_URL}products/presentations/all`;
export const createStorageOrder = `${QA_BASE_URL}orders/create`;
export const editStorageOrder = `${QA_BASE_URL}orders/edit/`;

export const closeDay = `${QA_BASE_URL}suppliers/operationEnd`;
export const openDay = `${QA_BASE_URL}suppliers/operationStart`;

export const customersDate = `${QA_BASE_URL}deliveryRoutes/customersDate`;

// Customers
export const customersUrl = `${QA_BASE_URL}customers/all`;
export const customersSupplierUrl = `${QA_BASE_URL}customers/supplier/`;
export const createCustomer = `${QA_BASE_URL}customers/createcustomersupplier`;
export const customerDetail = `${QA_BASE_URL}customers/serch/`;
export const customerUpdate = `${QA_BASE_URL}customers/updatecustomersupplier/`;
export const deleteCustomer = `${QA_BASE_URL}customers/deletecustomersupplier/`;
export const disableCustomer = `${QA_BASE_URL}customers/delete/`;
export const assignCustomer = `${QA_BASE_URL}deliveryRoutes/assigncustomers`;

// Prices
export const pricesUrl = `${QA_BASE_URL}prices/all`;
export const pricesBySupplier = `${QA_BASE_URL}prices/supplier/`;
export const createPrice = `${QA_BASE_URL}prices/create`;
export const priceDetail = `${QA_BASE_URL}prices/info/`;
export const priceUpdate = `${QA_BASE_URL}prices/update/`;
export const priceDelete = `${QA_BASE_URL}prices/delete/`;

// Bands
export const bandsUrl = `${QA_BASE_URL}bands/all`;

// Routes
export const routesUrl = `${QA_BASE_URL}deliveryRoutes/all`;

// Groups
export const groupsUrl = `${QA_BASE_URL}group/all`;

export const printOrdersUrl = `${QA_BASE_URL}`;

// peticion post
// data
// const postData = {
//   days: 2, opcional
//   supplier: idSupplier,
// }
export const dateAvailable = `${QA_BASE_URL}suppliers/operationHistory`;

// peticion post
// data
// const dateData = {
//   date: date,
// }
export const routesByDate = `${QA_BASE_URL}deliveryRoutes/show`;

// Types
export const typesUrl = `${QA_BASE_URL}types/all`;
