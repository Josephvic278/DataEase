import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import 'boxicons/css/boxicons.min.css'; // Importing Boxicons CSS
function AboutUs() {
    const [open, setOpen] = React.useState(1);

    const handleOpen = (value) => setOpen(open === value ? 0 : value);
  
    return (
      <>
      <div id='faq'>
        <h1 className="text-center text-3xl mb-8 font-medium">AboutUs</h1>
      </div>
        <Accordion open={open === 1} className="border rounded-lg shadow-md mb-4">
          <AccordionHeader
            className="flex items-center justify-between text-lg font-medium bg-green-50 p-4 hover:bg-green-100 h-20"
            onClick={() => handleOpen(1)}
          >
            <div className="flex items-center">
              <i className='bx bx-question-mark text-vibrantGreen text-2xl'></i>
              <span className="ml-2">What you need to know about us!</span>
            </div>
            {/* <i className={`bx bx-chevron-down text-vibrantGreen text-2xl transition-transform duration-300 ${open === 1 ? "rotate-180" : ""}`}></i> */}
          </AccordionHeader>
          <AccordionBody className="p-8 bg-white ">
          DataEase provides quick and reliable VTU services, including airtime, data, and bill payments, for individuals and businesses.
Getting is easier, better and Affordable. We priotize the satisfaction of our customers.
          </AccordionBody>
        </Accordion>
  
       
      </>
    );
}

export default AboutUs