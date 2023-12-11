<tbody className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* CODIGO DE PRODUCTO */}
                  {columns.map(
                    (column, columnIndex) =>
                    initialColumns.includes((column, columnIndex) && (
                    <>
                  <td className='px-4' key={columnIndex}>{row[column]}</td>

                  <td
                    className={`w-[14.2%] px-6 py-2 border-r-2 border-r-[#0c547a] border-[#808e94] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <AutocompleteInput
                      options={products}
                      value={row.productCode}
                      onChange={(selectedProductCode) => {
                        const updatedRows = [...rows];
                        const selectedProduct = products.find(
                          (product) => product.value === selectedProductCode
                        );

                        if (selectedProduct) {
                          updatedRows[rowIndex].presentation =
                            selectedProduct.label;
                          updatedRows[rowIndex].productCode =
                            selectedProductCode;
                          setRows(updatedRows);
                        }
                      }}
                    />
                  </td>

                  {/*  *********** PRESENTACION *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2  border-r-2  border-r-[#0c547a] border-[#808e94] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.presentation[rowIndex]}
                      value={row.presentation}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].presentation = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, "presentation")
                      }
                      className="w-full outline-none"
                    />
                  </td>


                  {/*  *********** DESCRIPCION *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2   border-[#808e94] border-r-[#0c547a]  border-r-2 ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.description[rowIndex]}
                      value={row.description}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].description = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, "description")
                      }
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** UOM *********** */}
                  <td
                    className={`w-[14.2%] px-6 py-2  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.UOM[rowIndex]}
                      value={row.UOM}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].UOM = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "UOM")}
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** CANTIDAD *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.Qty[rowIndex]}
                      value={row.Qty}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].Qty = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "Qty")}
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** PRECIO *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.price[rowIndex]}
                      value={row.price}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].price = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "price")}
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** PRECIO TOTAL *********** */}
                  <td
                    className={`w-[14.2%] px-6 py-2   border-[#808e94]  ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.totalPrice[rowIndex]}
                      value={row.totalPrice}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].totalPrice = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, "totalPrice")
                      }
                      className="w-full outline-none"
                    />
                  </td>
                  </>
                  ))
                  )}
                  
                  </tr>
              ))}
            </tbody>