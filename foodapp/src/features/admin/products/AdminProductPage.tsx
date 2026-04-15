"use client";

import CustomButton from "@/shared/components/custom/CustomButton";
import Modal from "@/shared/components/custom/Modal";
import React, { useState } from "react";
import AddProductForm from "./components/AddProductForm";

const AdminProductPage = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const openAddProductModal = () => {
    setShowAddProductModal(true);
  };

  const closeAddCategoryModal = () => {
    setShowAddProductModal(false);
  };

  return (
    <>
      <section
        aria-label="admin-product-page"
        className="  p-4 rounded-md min-h-screen"
      >
        <section aria-label="Add-Category" className="my-6 flex justify-end">
          <CustomButton onClick={openAddProductModal} active className="">
            Add Product
          </CustomButton>
        </section>
      </section>

      {/*---------------- modal for add product form-------------  */}
      <Modal
        isVisible={showAddProductModal}
        onClose={closeAddCategoryModal}
        width="60%"
        content={<AddProductForm />}
      />
    </>
  );
};

export default AdminProductPage;
