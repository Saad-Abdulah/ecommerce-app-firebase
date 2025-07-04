/* eslint-disable react/prop-types */
import {
    Button,
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                className="w-full px-4 py-3 text-center text-gray-100 bg-pink-600 border border-transparent dark:border-gray-700 hover:border-pink-500 hover:text-pink-700 hover:bg-pink-100 rounded-xl"
            >
                Buy now
            </Button>
            <Dialog 
                open={open} 
                handler={handleOpen} 
                className="fixed inset-0 z-50 flex items-center"
                size="xs"   
            >
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleOpen}></div>
                <div className="relative bg-pink-50 p-6 rounded-xl shadow-xl w-96 mx-auto">
                    <DialogBody className="p-0">
                        <div className="mb-3">
                            <input
                                type="text"
                                name="name"
                                value={addressInfo.name}
                                onChange={(e) => {
                                    setAddressInfo({
                                        ...addressInfo,
                                        name: e.target.value
                                    })
                                }}
                                placeholder='Enter your name'
                                className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="address"
                                value={addressInfo.address}
                                onChange={(e) => {
                                    setAddressInfo({
                                        ...addressInfo,
                                        address: e.target.value
                                    })
                                }}
                                placeholder='Enter your address'
                                className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="number"
                                name="pincode"
                                value={addressInfo.pincode}
                                onChange={(e) => {
                                    setAddressInfo({
                                        ...addressInfo,
                                        pincode: e.target.value
                                    })
                                }}
                                placeholder='Enter your pincode'
                                className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                name="mobileNumber"
                                value={addressInfo.mobileNumber}
                                onChange={(e) => {
                                    setAddressInfo({
                                        ...addressInfo,
                                        mobileNumber: e.target.value
                                    })
                                }}
                                placeholder='Enter your mobileNumber'
                                className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={handleOpen}
                                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    handleOpen();
                                    buyNowFunction();
                                }}
                                className="flex-1 px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors duration-200"
                            >
                                Buy now
                            </Button>
                        </div>
                    </DialogBody>
                </div>
            </Dialog>
        </>
    );
}

export default BuyNowModal;