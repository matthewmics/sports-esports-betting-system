import React, { useEffect } from 'react'

/***********************************************************
*** I'VE DECIDED TO LET PAYPAL WEBHOOKS HANDLE CAPTURING ***
*** TO ENSURE USER GETS HIS CREDITS AFTER A SUCCESSFULL  ***
*** PAYMENT.                                             ***
/***********************************************************
*/
export const PaypalCaptureOrder = () => {
    useEffect(() => {
        window.close();
    }, []);

    return (
        <div></div>
    )
}
