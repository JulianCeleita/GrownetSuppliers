//BASE URL
const BASE_URL = "https://api.grownetapp.com/grownet/api/";
// const BASE_URL = "http://3.139.16.141/api/";

// Login
export const loginUrl = `${BASE_URL}login/login`;

// Users
export const usersUrl = `${BASE_URL}user/all`;

// Products
export const productsUrl = `${BASE_URL}products/all`;
export const addProductUrl = `${BASE_URL}products/create`;
export const updateProductUrl = `${BASE_URL}products/update/`;
export const deleteProductUrl = `${BASE_URL}products/delete/`;

//Presentations
export const presentationsUrl = `${BASE_URL}presentations/all`;
export const presentationsSupplierUrl = `${BASE_URL}presentations/supplier/`;
export const addPresentationUrl = `${BASE_URL}presentations/create`;
export const updatePresentationUrl = `${BASE_URL}presentations/update/`;
export const deletePresentationUrl = `${BASE_URL}presentations/delete/`;

//Categories
export const categoriesUrl = `${BASE_URL}categories/all`;
export const addCategoryUrl = `${BASE_URL}categories/created`;
export const updateCategoryUrl = `${BASE_URL}categories/updated/`;
export const deleteCategoryUrl = `${BASE_URL}categories/delete/`;

//Suppliers
export const suppliersUrl = `${BASE_URL}suppliers/all`;
export const addSupplierUrl = `${BASE_URL}suppliers/create`;
export const updateSupplierUrl = `${BASE_URL}suppliers/update/`;
export const deleteSupplierUrl = `${BASE_URL}suppliers/delete/`;

//Families
export const familiesUrl = `${BASE_URL}families/all`;

//UOM
export const uomUrl = `${BASE_URL}uom/all`;

//Taxes
export const taxexUrl = `${BASE_URL}taxes/all`;

//Orders
export const ordersUrl = `${BASE_URL}orders/all`;
export const ordersSupplierUrl = `${BASE_URL}orders/supplier/`;
export const orderDetail = `${BASE_URL}orders/`;
export const restaurantsData = `${BASE_URL}customers/all`;
export const createOrders = `${BASE_URL}orders/create`;
export const ordersDate = `${BASE_URL}orders/search/date`;
export const customerSupplier = `${BASE_URL}customers/supplier/`;
export const orderCSV = `${BASE_URL}SCVExport/ordersDetails`;
export const deleteOrder = `${BASE_URL}orders/delete/`;
export const printInvoices = `${BASE_URL}invoice/generate`;
export const customersData = `${BASE_URL}customers/serch/`;
export const presentationsCode = `${BASE_URL}presentations/search/`;
export const presentationData = `${BASE_URL}products/presentations/all`;
export const createStorageOrder = `${BASE_URL}orders/create`;
export const editStorageOrder = `${BASE_URL}orders/edit/`;

// Upload CSV
export const uploadCsv = `${BASE_URL}orders/uploadCSV`

// Day managment
export const closeDay = `${BASE_URL}suppliers/operationEnd`;
export const openDay = `${BASE_URL}suppliers/operationStart`;

export const customersDate = `${BASE_URL}deliveryRoutes/customersDate`;

// Customers
export const customersUrl = `${BASE_URL}customers/all`;
export const customersSupplierUrl = `${BASE_URL}customers/supplier/`;
export const createCustomer = `${BASE_URL}customers/createcustomersupplier`;
export const customerDetail = `${BASE_URL}customers/serch/`;
export const customerUpdate = `${BASE_URL}customers/updatecustomersupplier/`;
export const deleteCustomer = `${BASE_URL}customers/deletecustomersupplier/`;
export const disableCustomer = `${BASE_URL}customers/delete/`;
export const assignCustomer = `${BASE_URL}deliveryRoutes/assigncustomers`;

// Prices
export const pricesUrl = `${BASE_URL}prices/all`;
export const pricesBySupplier = `${BASE_URL}prices/supplier/`;
export const createPrice = `${BASE_URL}prices/create`;
export const priceDetail = `${BASE_URL}prices/info/`;
export const priceUpdate = `${BASE_URL}prices/update/`;
export const priceDelete = `${BASE_URL}prices/delete/`;

// Bands
export const bandsUrl = `${BASE_URL}bands/all`;

// Routes
export const routesUrl = `${BASE_URL}deliveryRoutes/all`;

// Groups
export const groupsUrl = `${BASE_URL}group/all`;

export const printOrdersUrl = `${BASE_URL}`;

// peticion post
// data
// const postData = {
//   days: 2, opcional
//   supplier: idSupplier,
// }
export const dateAvailable = `${BASE_URL}suppliers/operationHistory`;

// peticion post
// data
// const dateData = {
//   date: date,
// }
export const routesByDate = `${BASE_URL}deliveryRoutes/show`;

// Types
export const typesUrl = `${BASE_URL}types/all`;

// Shorts
export const productShort = `${BASE_URL}products/short`
export const categoriesShort = `${BASE_URL}categories/short`

