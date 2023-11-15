"use client";
import { Button, Modal } from "flowbite-react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PlaceOrder() {

  return (
    <Modal
      className=""
      show={modal.isOpen}
      position={'center'}
      onClose={() => setModal({ isOpen: false })}
    >
      <Modal.Header>PERSONAL DETAILS</Modal.Header>
      <Modal.Body>
        {/* Inputs name, phone, email, address, check box to aknowlege */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry-0 outline-none focus:border-secondry-0"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">Phone</label>
            <PhoneInput country={"ae"} enableSearch={true} specialLabel=""  inputStyle={{ width: "100%", height:"42px", }} />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">Address</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry-0 outline-none focus:border-secondry-0"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-ITC-BK">Email</label>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-secondry-0 outline-none focus:border-secondry-0"
            />
          </div>
        
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="gray"
          className="uppercase w-full bg-secondry-0 text-white font-ITC-BK"
        >
          place order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PlaceOrder;
