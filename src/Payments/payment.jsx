import axios from 'axios';
import { Button } from 'bootstrap';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { CreditCard,GooglePay,PaymentForm } from 'react-square-web-payments-sdk';
import useAuthContext from '../AuthLogic/useAuthContext';
import { URL } from '../../global';

const MyPaymentForm = () => {
    let {state}=useLocation()
    const data=JSON.parse(state.data)
    console.log(data)
    const pincode=state.pincode
    const applicationId = 'sandbox-sq0idb-S6tnfoAhr57i7dM1g_JcLA'; // Replace with your Square application ID
    const locationId = 'LA5HW6BQASANE'; // Replace with your Square location ID
    const [profile,setprofile]=useState({})
    const [isLoading,setLoading]=useState(false)
    const [paymentResult, setPaymentResult] = useState(null);
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [postalcode, setPostalcode] = useState('');
    const [country, setCountry] = useState('');
    const [name, setname] = useState('');
    const [complete,setcomplete]=useState(false)
    const [nannyprofile,setnannyprofile]=useState({})

    const [app,setapp]=useState({})

    const {auth}=useAuthContext()
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.user.access}`;

  const fetchprofile = async (id) => {
    await axios.get(`${ URL }/api/accounts/list/`).then((res) => {
      const data=res.data.filter((item)=>{
        console.log(item.id,id)
        if(item.id==id){
          return item
        }
      })
      setprofile(data[0])
      setEmail(data[0].email)
      setname(data[0].name)
      console.log("user",data[0])

    });
  }

  const fetchprofileNanny = async (id) => {
    await axios.get(`${ URL }/api/accounts/list/`).then((res) => {
      const data=res.data.filter((item)=>{
        console.log(item.id,id)
        if(item.id==id){
          return item
        }
      })
      setnannyprofile(data[0])
      console.log("nanny",data[0])

    });
  }

  const fetchdataNanny=async()=>{
    try {
        await axios.get(`${ URL }/api/app/list/`).then((res)=>{
        const newdata=res.data.filter((item)=>{
            if(item.id == Number(data.profile)){
                return item
            }
        })
        const data1 = newdata[0]
        setapp(data1)
        console.log(data1)
        
    })
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

  useEffect(()=>{
    fetchprofile(data.user)
    fetchdataNanny()
  },[])

  useEffect(()=>{
    if(app != {}){
      fetchprofileNanny(app.user)
    }
  },[app])

  const subject = `Booking Generated For You by ${profile.email}`

  const message = `${profile.name} / ${profile.email} has booked you for ${data.day} from ${data.from_time} to ${data.to_time}.`

  const generateHtmlMessage = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .email-header {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            Email Subject: ${subject}
          </div>
          <div class="email-body">
            <p>Dear ${nannyprofile.email},</p>
            <p>This Email has been sent to inform you that:</p>
            <ul>
              <li>
                ${message}
              </li>
            </ul>
            <p>Best Regards,<br>Care.com</p>
          </div>
          <div class="email-footer">
            &copy; 2024 Care.com, All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  };


  const sendEmail = async () => {
    try {
      await axios.post('http://localhost:5000/sendemail', {
        to: nannyprofile.email,
        subject: subject,
        text: message, // Optional plain text version
        html: generateHtmlMessage(), // HTML version
      });
      alert('Email sent successfully');
      setLoading(false)
      setcomplete(true)
    } catch (error) {
      console.error('Error sending email', error);
      alert('Failed to send email');
    }
  };


  const handleBooking=async()=>{
    const newdata={...data,
        address:address,
        district:district,
        postalcode:postalcode,
        country:country
    }
    await axios.post(`${ URL }/api/bookings/addBooking/`,newdata).then((res)=>{
        console.log(res.data)
        sendEmail()
    })
  }

  const handlePayment = async (token) => {
    setLoading(true)
    const newcoun=country.slice(0,2).toUpperCase();
    await axios.post("http://localhost:5000/payment",{
        sourceId:token.token,
        amount:data.price,
        email:email,
        address:address,
        district:district,
        postalcode:postalcode,
        country:newcoun,
        firstname:"user",
        lastname:name
    }).then((res)=>{
        console.log(res.data);
        setPaymentResult(res.data)
        handleBooking()
    })
  };

  return (
    <div>
    {!complete && (<div className='mx-64 my-14 flex flex-row'>
        <div className='w-1/4'>
            <div className="max-w-md mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">Email:</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-lg font-medium text-gray-700 mb-1">Address:</label>
                  <input
                    type="text"
                    id="address"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="district" className="block text-lg font-medium text-gray-700 mb-1">District:</label>
                  <input
                    type="text"
                    id="district"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="postalcode" className="block text-lg font-medium text-gray-700 mb-1">Postal Code:</label>
                  <input
                    type="text"
                    id="postalcode"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={pincode}
                    onChange={(e) => setPostalcode(e.target.value)}
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="country" className="block text-lg font-medium text-gray-700 mb-1">Country:</label>
                  <input
                    type="text"
                    id="country"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-1">Name:</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                  />
                </div>
    
              </form>
            </div>
        </div>
        <div className='w-3/4 flex flex-col justify-center mx-20'>
            <PaymentForm
              applicationId={applicationId}
              locationId={locationId}
              cardTokenizeResponseReceived={(token, buyer) => handlePayment(token)}
            >
              <CreditCard
                placeholders={{
                  cardNumber: 'Card Number',
                  cvv: 'CVV',
                  expirationDate: 'MM/YY',
                  postalCode: 'ZIP', // Change placeholder for ZIP code
                }}
                inputStyles={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '16px',
                }}
                inputClassNames={{
                  focus: 'focused', // Add custom class for focused state
                }}
                inputWrapperStyle={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '4px',
                }}
                errorClassNames={{
                  fontSize: '12px', // Adjust error message font size
                }}
                errorComponent={({ error }) => (
                  <div className="error-message">{error}</div>
                )}
            />
            </PaymentForm>
            {isLoading&&(
            <div className='mx-auto mt-7'>
                <div role="status">
                   <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                       <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                   </svg>
                   <span className="sr-only">Loading...</span>
                </div>
            </div>
        )}
        </div>
    </div>)}
    {complete && (
        <div className='mx-auto flex flex-col items-center my-20'>
            <img src="/payment-success.svg"></img>
            <div className='text-5xl font-semibold border-b-4 border-red-400'>
                Payment Successful
            </div>
            <Link to={"/"} className='px-7 py-5 bg-red-400 text-white rounded-full text-3xl shadow-xl hover:brightness-75 mt-10'>
                Go To Homepage
            </Link>
        </div>
    )}
    </div>
  );
};

export default MyPaymentForm;